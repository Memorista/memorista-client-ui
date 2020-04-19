# MVP

- Fetch guestbook details (title and description)
- View guestbook posts
- Create guestbook post (with name and text)
- Embeddable code snippet

# Embeddable code snippet

## Head

```html
<link rel="stylesheet" href="/dist/guesty.min.css" />
```

## Body

```html
<div id="guesty-root"></div>
<script src="/dist/guesty.min.js"></script>
<script>
  Guesty.init({
    container: document.getElementById('guesty-root'),
    apiBaseUrl: 'http://localhost:3000',
    apiKey: '',
  });
</script>
```
