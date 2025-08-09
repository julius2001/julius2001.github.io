---
title: contact.title
styles:
  - style1
order: 6
---

## {% t contact.title_long %}
{% responsive_image path: assets/img/happyjulius.jpg %}
{% t contact.text %}

- ### {% t contact.email %}
  [{{ site.email }}](mailto:{{ site.email }})
- ### {% t contact.address %}
  Toppåsveien 8A \
  1262 Oslo \
  {% t contact.country %}
- ### {% t contact.orgnumb %}
  935024692
- ### {% t contact.social %}
  - <a href="https://www.facebook.com/profile.php?id={{ site.facebook_id }}" class="icon brands fa-facebook-f"><span class="label">Facebook</span></a>
  - <a href="https://www.instagram.com/{{ site.instagram_username }}" class="icon brands fa-instagram"><span class="label">Instagram</span></a>
  - <a href="https://www.linkedin.com/in/{{ site.linkedin_id }}/" class="icon brands fa-linkedin-in"><span class="label">LinkedIn</span></a>
  - <a href="https://open.spotify.com/artist/{{ site.spotify_id }}" class="icon brands fa-spotify"><span class="label">Spotify</span></a>
  - <a href="https://www.youtube.com/@{{ site.youtube_username }}" class="icon brands fa-youtube"><span class="label">YouTube</span></a>
  {: .icons }
{: .contact}