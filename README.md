# whatsclip.app

The site of WhatsClip, the clipboard viewer built with
[ClaFi - Clarity First the Framework](https://github.com/clafi-fw/cpp). Plain HTML, CSS and
JavaScript, served by GitHub Pages from the root of `main`; nothing is built.

- `index.html` - the start page: what WhatsClip does, one panel per feature, and the downloads.
- `install.html` - the install guide: both systems, checking a download, the settings folder,
  removing, and where the sources are.
- `assets/site.js` - asks GitHub for the newest `WhatsClip-v*` and `Themes-v*` releases of
  clafi-fw/cpp and writes the version, links, sizes and checksums into the pages. The pages as
  written name 0.1.0 and stay that way when GitHub cannot be reached.
- `assets/illustrations.*` - drawn stand-ins for screenshots; see [shots/README.md](shots/README.md).

A new WhatsClip release needs no change here.

## Publishing

1. Settings - Pages: deploy from a branch, `main`, folder `/ (root)`.
2. The domain, at the registrar - the apex points at GitHub Pages, `www` at the account's Pages host:

   | Type  | Name  | Value |
   |-------|-------|-------|
   | A     | @     | 185.199.108.153 |
   | A     | @     | 185.199.109.153 |
   | A     | @     | 185.199.110.153 |
   | A     | @     | 185.199.111.153 |
   | AAAA  | @     | 2606:50c0:8000::153 |
   | AAAA  | @     | 2606:50c0:8001::153 |
   | AAAA  | @     | 2606:50c0:8002::153 |
   | AAAA  | @     | 2606:50c0:8003::153 |
   | CNAME | www   | clafi-fw.github.io |

   The domain is registered at Cloudflare, so the records live in its DNS. Each one is set to
   DNS only (grey cloud) - through Cloudflare's proxy GitHub cannot issue the certificate.

3. The account's Settings - Pages (github.com/settings/pages): verify `whatsclip.app`, so no other
   account can claim it.
4. Once the certificate is issued, tick Enforce HTTPS. A `.app` domain is reachable over HTTPS only.

## Trying it locally

`python -m http.server` in this folder, then http://localhost:8000.
