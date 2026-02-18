---
layout: splash
permalink: /
title: "환자에게 먼저 설명해 주고 싶은 치아 이야기"
header:
  overlay_color: "#0f172a"
  overlay_filter: "0.35"
  overlay_image: /assets/img/posts/gum-inflammation-toothpaste/main.png
  actions:
    - label: "상담 · 예약"
      url: /contact/
      class: "btn btn--primary"
    - label: "네이버 블로그"
      url: https://blog.naver.com/studytosurvive
      class: "btn btn--inverse"
intro:
  - excerpt: |
      임상에서 하루에도 수십 번 듣는 질문을 블로그에 차근차근 정리하고 있어요. 
      잇몸이 붓는 이유, 임플란트 후 관리, 일상 속 양치 습관까지 — **환자 입장에서 이해할 수 있는 언어**로 풀어드립니다.
feature_row:
  - image_path: /assets/img/posts/gum-inflammation-toothpaste/gingivitis.jpg
    alt: 잇몸 염증 이미지
    title: 잇몸이 자주 붓는다면?
    excerpt: 잇몸염증 신호, 진짜 도움이 되는 치약 고르는 법, 병원에 가야 하는 시점까지 정리했어요.
    url: /posts/gum-inflammation-toothpaste/
    btn_label: "글 읽기"
    btn_class: "btn--primary"
  - image_path: /assets/img/posts/gum-inflammation-toothpaste/brushing.png
    alt: 올바른 양치법
    title: 올바른 양치 루틴
    excerpt: 칫솔 각도, 치실 순서, 생활 속 팁을 의료진 시점에서 간결하게 안내합니다.
    url: /tags/%EC%B9%98%EC%95%BD%EC%B6%94%EC%B2%9C/
    btn_label: "습관 만들기"
    btn_class: "btn--inverse"
  - image_path: /assets/img/posts/gum-inflammation-toothpaste/scaling.jpg
    alt: 스케일링 장면
    title: 언제 스케일링이 필요할까요?
    excerpt: 치석, 입냄새, 잇몸 출혈 중 하나라도 있다면 체크해야 할 기준들을 체크리스트로 제공합니다.
    url: /categories/%EC%B9%98%EA%B3%BC%EC%82%AC%EC%A0%84/
    btn_label: "체크하기"
    btn_class: "btn--primary"
---

{% include feature_row id="intro" type="center" %}

{% include feature_row %}

{% assign latest_posts = site.posts | slice: 0, 3 %}
{% if latest_posts.size > 0 %}
<section class="page__content">
  <h2>최근 업데이트</h2>
  <div class="archive__grid">
  {% for post in latest_posts %}
    <article class="archive__item">
      <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
      <p class="page__meta">{{ post.date | date: "%Y.%m.%d" }} · {{ post.read_time }} 읽음</p>
      <p>{{ post.excerpt | strip_html | truncate: 140 }}</p>
    </article>
  {% endfor %}
  </div>
</section>
{% endif %}

<div class="notice--success">
  <p>정기 구독을 원하면 <a href="{{ "/feed.xml" | relative_url }}">RSS</a> 나 네이버 이웃 추가로 받아볼 수 있어요.</p>
</div>
