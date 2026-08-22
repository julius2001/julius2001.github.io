---
title: news.title
styles:
  - style1
order: 1
spotlights: true
banner: banner-piano.jpg
---

{% for post in site.posts %}
<section>
    {% if post.image %}<a {% if post.image_link %}href="{{ post.image_link }}"{% endif %} class="image">{% responsive_image_block %}
    path: assets/img/{{ post.image }}
    template: _includes/responsive-image-news.html
    {% endresponsive_image_block %}{% if post.image_credit %}<span class="image-credit">Photo: {{ post.image_credit }}</span>{% endif %}</a>{% endif %}
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