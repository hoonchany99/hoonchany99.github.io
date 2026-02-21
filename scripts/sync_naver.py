#!/usr/bin/env python3
"""
네이버 블로그 → GitHub Pages 자동 동기화 스크립트
사용법: python3 scripts/sync_naver.py
"""

import asyncio
import json
import os
import re
import ssl
import subprocess
import sys
import time
import urllib.request
import urllib.parse
from urllib.parse import urlparse, unquote
from datetime import datetime

# ──────────────────────────── 설정 ────────────────────────────

BLOG_ID = "doctoryoon-kr"
CATEGORY_NO = 7  # 치과사전 일상편
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS_DIR = os.path.join(BASE, "src/content/posts")
IMG_DIR = os.path.join(BASE, "public/img/posts")
LOG_FILE = os.path.join(BASE, "scripts/sync.log")

SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE

NOISE_TAGS = {"취소", "확인", "윤원장의치과사전", "윤원장", "치과사전"}

# 한국어 → 영어 slug 매핑 (치과 용어)
SLUG_MAP = {
    "임플란트": "implant", "크라운": "crown", "인레이": "inlay",
    "사랑니": "wisdom-tooth", "충치": "cavity", "신경치료": "root-canal",
    "스케일링": "scaling", "미백": "whitening", "라미네이트": "laminate",
    "잇몸": "gum", "발치": "extraction", "교정": "orthodontic",
    "보철": "prosthesis", "레진": "resin", "온레이": "onlay",
    "치아": "tooth", "치과": "dental", "통증": "pain",
    "시림": "sensitivity", "비용": "cost", "가격": "price",
    "보험": "insurance", "입냄새": "bad-breath", "구취": "halitosis",
    "양치": "brushing", "치약": "toothpaste", "불소": "fluoride",
    "유치": "baby-tooth", "앞니": "front-teeth", "어금니": "molar",
    "턱관절": "jaw-joint", "양악": "jaw-surgery", "마취": "anesthesia",
    "뼈이식": "bone-graft", "치주염": "periodontitis", "치은염": "gingivitis",
    "구강": "oral", "수면": "sleep", "전신마취": "general-anesthesia",
    "파절": "fracture", "깨짐": "crack", "출혈": "bleeding",
    "붓기": "swelling", "염증": "inflammation", "세렉": "cerec",
    "지르코니아": "zirconia", "골드": "gold", "세라믹": "ceramic",
    "상악동": "sinus", "매복": "impacted", "수평": "horizontal",
    "건조와": "dry-socket", "캡션": "caption", "관리": "care",
    "수명": "lifespan", "기간": "duration", "후": "after",
    "전": "before", "이유": "reason", "방법": "method",
    "증상": "symptom", "원인": "cause", "치료": "treatment",
    "종류": "types", "비교": "comparison", "추천": "recommend",
    "주의": "caution", "부작용": "side-effect", "회복": "recovery",
}


def log(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")


# ──────────────────────────── 1. 글 목록 가져오기 ────────────────────────────

async def fetch_post_list():
    """네이버 블로그에서 일상편 카테고리의 글 목록을 가져옵니다."""
    from playwright.async_api import async_playwright

    posts = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        page_num = 1
        while True:
            url = f"https://blog.naver.com/PostList.naver?blogId={BLOG_ID}&from=postList&categoryNo={CATEGORY_NO}&currentPage={page_num}"
            await page.goto(url, wait_until="domcontentloaded", timeout=20000)
            await page.wait_for_timeout(2000)

            frame = page.frame(name="mainFrame")
            if not frame:
                break

            items = await frame.query_selector_all(".blog2_series .title a, table.blog2_list td.title a, .wrap_list .title a, a.pcol2")
            if not items:
                items = await frame.query_selector_all("table td a[href*='logNo']")
            if not items:
                items = await frame.query_selector_all("a[href*='Redirect=Log']")
            if not items:
                break

            found_new = False
            for item in items:
                href = await item.get_attribute("href") or ""
                text = (await item.inner_text()).strip()
                if not text or not href:
                    continue

                log_no_m = re.search(r'logNo=(\d+)', href) or re.search(r'/(\d+)$', href)
                if not log_no_m:
                    continue
                log_no = log_no_m.group(1)

                if any(pp["logNo"] == log_no for pp in posts):
                    continue

                posts.append({
                    "url": f"https://blog.naver.com/{BLOG_ID}/{log_no}",
                    "logNo": log_no,
                    "title": text,
                })
                found_new = True

            if not found_new:
                break

            page_num += 1
            if page_num > 20:
                break

        # 날짜 가져오기 (각 글 방문)
        for post in posts:
            try:
                await page.goto(post["url"], wait_until="domcontentloaded", timeout=15000)
                await page.wait_for_timeout(1500)
                frame = page.frame(name="mainFrame")
                if frame:
                    date_el = await frame.query_selector(".se_publishDate, .blog_date, .se-date, .date")
                    if date_el:
                        date_text = await date_el.inner_text()
                        date_m = re.search(r'(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})', date_text)
                        if date_m:
                            post["date"] = f"{date_m.group(1)}-{int(date_m.group(2)):02d}-{int(date_m.group(3)):02d}"
                if "date" not in post:
                    post["date"] = datetime.now().strftime("%Y-%m-%d")
            except:
                post["date"] = datetime.now().strftime("%Y-%m-%d")

        await browser.close()

    return posts


# ──────────────────────────── 2. Slug 생성 ────────────────────────────

def generate_slug(title: str, existing_slugs: set) -> str:
    """한국어 제목을 영어 slug으로 변환"""
    slug_parts = []
    title_lower = title.lower()

    for ko, en in sorted(SLUG_MAP.items(), key=lambda x: -len(x[0])):
        if ko in title_lower:
            if en not in slug_parts:
                slug_parts.append(en)
            if len(slug_parts) >= 3:
                break

    if not slug_parts:
        cleaned = re.sub(r'[^\w\s-]', '', title)
        cleaned = re.sub(r'\s+', '-', cleaned).strip('-').lower()
        slug_parts = [cleaned[:50] if cleaned else "post"]

    slug = "-".join(slug_parts)
    slug = re.sub(r'-+', '-', slug).strip('-')

    if slug in existing_slugs:
        log_no = str(hash(title))[-4:]
        slug = f"{slug}-{log_no}"

    return slug


# ──────────────────────────── 3. HTML 추출 ────────────────────────────

async def extract_html(posts_to_process):
    """새 글의 HTML을 추출합니다."""
    from playwright.async_api import async_playwright

    results = {}
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        for i, post in enumerate(posts_to_process):
            slug = post["slug"]
            url = post["url"]
            log(f"  [{i+1}/{len(posts_to_process)}] HTML 추출: {slug}")

            try:
                await page.goto(url, wait_until="domcontentloaded", timeout=30000)
                await page.wait_for_timeout(3000)

                frame = page.frame(name="mainFrame")
                if not frame:
                    for f in page.frames:
                        if "PostView" in (f.url or ""):
                            frame = f
                            break

                if not frame:
                    log(f"    프레임을 찾을 수 없음")
                    continue

                container = await frame.query_selector(".se-main-container")
                if not container:
                    await page.wait_for_timeout(3000)
                    container = await frame.query_selector(".se-main-container")

                if not container:
                    log(f"    컨테이너를 찾을 수 없음")
                    continue

                html = await container.inner_html()
                results[slug] = html
                log(f"    OK ({len(html)//1024}KB)")

            except Exception as e:
                log(f"    오류: {e}")

        await browser.close()

    return results


# ──────────────────────────── 4. 태그 추출 ────────────────────────────

async def scrape_tags(posts_to_process):
    """새 글의 태그를 가져옵니다."""
    from playwright.async_api import async_playwright

    tag_map = {}
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        for post in posts_to_process:
            slug = post["slug"]
            url = post["url"]
            tags = []

            try:
                await page.goto(url, wait_until="domcontentloaded", timeout=15000)
                await page.wait_for_timeout(1000)

                frame = page.frame(name="mainFrame")
                if frame:
                    await frame.wait_for_load_state("domcontentloaded", timeout=10000)
                    await page.wait_for_timeout(500)
                    tag_els = await frame.query_selector_all(
                        ".tag_post a, .post_tag a, .wrap_tag a, .se-tag a, "
                        "#hashTagArea a, .post-tag a, [class*='tag'] a, [class*='Tag'] a"
                    )
                    for el in tag_els:
                        text = (await el.inner_text()).strip().lstrip('#').strip()
                        if text and len(text) < 30 and text not in NOISE_TAGS:
                            tags.append(text)

                seen = set()
                unique = []
                for t in tags:
                    if t not in seen:
                        seen.add(t)
                        unique.append(t)
                tag_map[slug] = unique

            except:
                tag_map[slug] = []

        await browser.close()

    return tag_map


# ──────────────────────────── 5. 이미지 다운로드 & 포스트 생성 ────────────────────────────

def download_image(url, dest):
    try:
        if "?type=" not in url:
            base_url = url.split("?")[0]
            url = base_url + "?type=w966"
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0",
            "Referer": "https://blog.naver.com/"
        })
        with urllib.request.urlopen(req, context=SSL_CTX, timeout=15) as resp:
            data = resp.read()
        if len(data) < 1000:
            return False
        with open(dest, "wb") as f:
            f.write(data)
        return True
    except:
        return False


def get_ext_from_url(url):
    path = urlparse(url).path
    fname = unquote(path.split("/")[-1])
    if "." in fname:
        ext = fname.rsplit(".", 1)[1].lower()
        if ext in ("png", "jpg", "jpeg", "gif", "webp"):
            return "." + ext
    return ".jpg"


def process_post(slug, title, date, html, tags):
    """HTML을 처리하고 .md 파일을 생성합니다."""
    img_dir = os.path.join(IMG_DIR, slug)
    os.makedirs(img_dir, exist_ok=True)

    # data-lazy-src 이미지 찾기
    img_pattern = re.compile(r'data-lazy-src="(https://postfiles\.pstatic\.net/[^"?]+)')
    seen_urls = set()
    urls_ordered = []
    for m in img_pattern.finditer(html):
        url = m.group(1)
        if url not in seen_urls:
            seen_urls.add(url)
            urls_ordered.append(url)

    # fallback: src
    if not urls_ordered:
        img_pattern2 = re.compile(r'src="(https://postfiles\.pstatic\.net/[^"?]+)')
        for m in img_pattern2.finditer(html):
            url = m.group(1)
            if url not in seen_urls:
                seen_urls.add(url)
                urls_ordered.append(url)

    # 이미지 다운로드
    url_to_local = {}
    for j, url in enumerate(urls_ordered):
        ext = get_ext_from_url(url)
        local_name = f"main{ext}" if j == 0 else f"img{j}{ext}"
        local_path = os.path.join(img_dir, local_name)
        local_web = f"/img/posts/{slug}/{local_name}"

        if not os.path.exists(local_path) or os.path.getsize(local_path) < 5000:
            download_image(url, local_path)

        url_to_local[url] = local_web

    # HTML 내 이미지 URL 치환
    for naver_url, local_url in url_to_local.items():
        html = re.sub(re.escape(naver_url) + r'\?type=w\d+_blur', local_url, html)
        html = re.sub(re.escape(naver_url) + r'\?type=w\d+', local_url, html)
        html = html.replace(naver_url, local_url)

    # 첫 이미지 (src에만 있고 data-lazy-src가 비어있는 경우) 처리
    first_ext_match = re.search(r'<img[^>]+src="(https?://[^"]*pstatic\.net[^"]*)"', html)
    if first_ext_match:
        naver_url = first_ext_match.group(1)
        ext = get_ext_from_url(naver_url)
        cover_name = f"cover{ext}"
        cover_local = f"/img/posts/{slug}/{cover_name}"
        cover_full = os.path.join(img_dir, cover_name)
        if download_image(naver_url, cover_full):
            full_tag = first_ext_match.group(0)
            new_tag = full_tag.replace(f'src="{naver_url}"', f'src="{cover_local}"')
            if 'data-lazy-src=""' in new_tag:
                new_tag = new_tag.replace('data-lazy-src=""', f'data-lazy-src="{cover_local}"')
            html = html.replace(full_tag, new_tag)

    # OG 링크 이미지 다운로드
    oglink_pattern = re.compile(r'src="(https?://dthumb-phinf\.pstatic\.net[^"]+)"')
    oglink_count = 0
    for m in oglink_pattern.finditer(html):
        og_url = m.group(1)
        oglink_count += 1
        og_name = f"oglink{oglink_count}.jpg"
        og_local = f"/img/posts/{slug}/{og_name}"
        og_full = os.path.join(img_dir, og_name)
        if download_image(og_url, og_full):
            html = html.replace(f'src="{og_url}"', f'src="{og_local}"')

    # 스크립트 태그 제거
    html = re.sub(r'<script[^>]*class="__se_module_data"[^>]*></script>', '', html)

    # 들여쓰기 제거 (Markdown 코드블록 방지)
    lines = html.split("\n")
    html = "\n".join(line.lstrip() for line in lines)
    html = re.sub(r'\n{3,}', '\n\n', html)

    # 메인 이미지 경로 결정
    main_img = f"/img/posts/{slug}/cover.jpg"
    for prefix in ["cover", "main"]:
        for ext in [".png", ".jpg", ".jpeg"]:
            if os.path.exists(os.path.join(img_dir, f"{prefix}{ext}")):
                main_img = f"/img/posts/{slug}/{prefix}{ext}"
                break

    # 태그 문자열
    tag_str = json.dumps(tags, ensure_ascii=False) if tags else "[]"
    desc = title.replace('"', '\\"')

    content = f'''---
title: "{title}"
date: {date}
categories: [치과사전]
tags: {tag_str}
description: "{desc}"
image:
  path: {main_img}
  alt: "{title}"
---

<article class="naver-post">
<div class="se-main-container">
{html.strip()}
</div>
</article>
'''

    md_path = os.path.join(POSTS_DIR, f"{slug}.md")
    with open(md_path, "w") as f:
        f.write(content)

    return True


# ──────────────────────────── 6. Git 커밋 & 푸시 ────────────────────────────

def git_push(new_count):
    os.chdir(BASE)
    subprocess.run(["git", "add", "-A"], check=True)

    result = subprocess.run(["git", "diff", "--cached", "--quiet"])
    if result.returncode == 0:
        log("변경사항 없음, 커밋 스킵")
        return

    msg = f"feat: 네이버 블로그 새 글 {new_count}개 자동 동기화"
    subprocess.run(["git", "commit", "-m", msg], check=True)
    subprocess.run(["git", "push", "origin", "master"], check=True)
    log(f"Git push 완료 ({new_count}개 새 글)")


# ──────────────────────────── 메인 ────────────────────────────

async def main():
    log("=" * 50)
    log("네이버 블로그 동기화 시작")

    # 기존 slug 목록
    existing_slugs = set()
    for f in os.listdir(POSTS_DIR):
        if f.endswith(".md"):
            existing_slugs.add(f[:-3])
    log(f"기존 글: {len(existing_slugs)}개")

    # 기존 logNo 매핑 (md 파일에서 naver URL 추출)
    existing_log_nos = set()
    for f in os.listdir(POSTS_DIR):
        if not f.endswith(".md"):
            continue
        with open(os.path.join(POSTS_DIR, f)) as fp:
            content = fp.read()
        for m in re.finditer(r'blog\.naver\.com/' + BLOG_ID + r'/(\d+)', content):
            existing_log_nos.add(m.group(1))

    # 네이버 글 목록 가져오기
    log("네이버 블로그 글 목록 가져오는 중...")
    all_posts = await fetch_post_list()
    log(f"네이버 전체 글: {len(all_posts)}개")

    # 새 글 필터링 (logNo 기준)
    new_posts = [p for p in all_posts if p["logNo"] not in existing_log_nos]
    log(f"새 글: {len(new_posts)}개")

    if not new_posts:
        log("새 글 없음. 종료.")
        return

    # slug 생성
    for post in new_posts:
        post["slug"] = generate_slug(post["title"], existing_slugs)
        existing_slugs.add(post["slug"])
        log(f"  새 글: {post['title']} → {post['slug']}")

    # HTML 추출
    log("HTML 추출 중...")
    html_map = await extract_html(new_posts)

    # 태그 추출
    log("태그 추출 중...")
    tag_map = await scrape_tags(new_posts)

    # 포스트 생성
    log("포스트 생성 중...")
    created = 0
    for post in new_posts:
        slug = post["slug"]
        if slug not in html_map:
            log(f"  건너뜀: {slug} (HTML 없음)")
            continue

        html = html_map[slug]
        tags = tag_map.get(slug, [])

        if process_post(slug, post["title"], post["date"], html, tags):
            created += 1
            log(f"  생성 완료: {slug}")

    if created > 0:
        log(f"\n{created}개 새 글 생성 완료. Git push 중...")
        git_push(created)
    else:
        log("생성된 글 없음.")

    log("동기화 완료!")
    log("=" * 50)


if __name__ == "__main__":
    asyncio.run(main())
