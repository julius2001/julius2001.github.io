---
title: News
styles:
  - style1
  - spotlights
order: 1
---

## News

{% for post in site.posts %}
<section>
    <div class="content">
        <div class="inner">
            <h4>{{ post.date | date_to_string: "ordinal" }}: {{ post.title }}</h4>
            {{ post.content }}
        </div>
    </div>
</section>
{% endfor %}