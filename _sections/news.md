---
title: News
styles:
  - style1
order: 1
spotlights: true
---

{% for post in site.posts %}
<section>
    {% if post.image %}<a {% if post.image_link %}href="{{ post.image_link }}"{% endif %} class="image"><img src="assets/img/{{ post.image }}" alt="" data-position="center center" /></a>{% endif %}
    <div class="content">
        <div class="inner">
            <header>
            <h3>{{ post.title }}</h3>
            <p>{{ post.date | date_to_string: "ordinal" }}</p>
            </header>
            {{ post.content }}
        </div>
    </div>
</section>
{% endfor %}