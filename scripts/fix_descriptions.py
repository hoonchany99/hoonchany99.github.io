#!/usr/bin/env python3
"""기존 블로그 글의 meta description을 본문 기반으로 개선합니다."""
import os
import re

POSTS_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "content", "posts")

def extract_description(title, body_html):
    plain = re.sub(r'<[^>]+>', ' ', body_html)
    plain = re.sub(r'\s+', ' ', plain).strip()
    plain = re.sub(r'[\u200b\xa0]', '', plain)

    sentences = []
    for s in re.split(r'(?<=[.?!])\s+', plain):
        s = s.strip()
        if len(s) > 10 and not s.startswith('http') and not s.startswith('blog.naver'):
            sentences.append(s)

    if sentences:
        desc = title + " " + " ".join(sentences[:2])
        if not desc.endswith(('.', '?', '!')):
            desc += "."
        if len(desc) > 160:
            desc = desc[:157] + "..."
        return desc
    return title


def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    fm_match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
    if not fm_match:
        return False

    frontmatter = fm_match.group(1)
    body = fm_match.group(2)

    title_m = re.search(r'^title:\s*"(.+?)"', frontmatter, re.MULTILINE)
    desc_m = re.search(r'^description:\s*"(.+?)"', frontmatter, re.MULTILINE)

    if not title_m or not desc_m:
        return False

    title = title_m.group(1)
    old_desc = desc_m.group(1)

    if len(old_desc) >= 50:
        return False

    new_desc = extract_description(title, body)
    if new_desc == old_desc:
        return False

    new_desc_escaped = new_desc.replace('"', '\\"')
    new_frontmatter = frontmatter.replace(
        f'description: "{old_desc}"',
        f'description: "{new_desc_escaped}"'
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(f'---\n{new_frontmatter}\n---\n{body}')

    print(f"  {os.path.basename(filepath)}")
    print(f"    Before: {old_desc}")
    print(f"    After:  {new_desc[:80]}...")
    return True


if __name__ == "__main__":
    updated = 0
    for fname in sorted(os.listdir(POSTS_DIR)):
        if not fname.endswith(".md"):
            continue
        if process_file(os.path.join(POSTS_DIR, fname)):
            updated += 1

    print(f"\n{updated}개 글의 description을 업데이트했습니다.")
