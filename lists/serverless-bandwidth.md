# The Cost of Serverless Bandwidth

If only bandwidth is concerned, then:

- Serverless provides typically have a free plain, often with 100 GB free
  transfer per month. VPS provides usually have no free plan.

- The cheapest paid plan of both serverless and VPS provides often include 1 TB
  free transfer per month, but the cheapest VPS plan is usually cheaper than
  serverless.

- Overage is expensive compared to included transfer. Overage seems an
  afterthought for many serverless providers. They do not meter it, or handle it
  case by case, or enforce a soft limit, or charge a much more expensively,
  compared to VPS.

- Cloudflare offers a distinguished deal on bandwidth.

## Comparison

| Provider                   | 1 GB | 100 GB | 1 TB  | Overage per GB |
| -------------------------- | ---- | ------ | ----- | -------------- |
| Digital Ocean App Platform | 0    | 12     | 102   | 0.10           |
| Netlify                    | 0    | 0      | 19    | 0.55           |
| Vercel                     | 0    | 0      | 20    | contact sale   |
| Gatsby                     | 0    | 0      | 42.50 | contact        |
| Render                     | 0    | 0      | 90    | 0.10           |
| Railway                    | 0    | 0      | n/a   | n/a            |
| Fly                        | 0    | 0      | 18    | 0.02/0.04/0.12 |
| LeanCloud                  | 0    | 7      | 97    | 0.10           |
| Heroku                     | 7    | 7      | 7     | n/a            |
| GitHub Pages               | 0    | 0      | n/a   | n/a            |
| Cloudflare Pages           | 0    | 0      | 0     | 0              |
| Digital Ocean Droplets     | 4    | 4      | 4     | 0.01           |
| Linode Compute             | 5    | 5      | 5     | 0.01           |
| Koyeb                      | 0    | 0      | 36    | 0.04           |

### Details

- [Digital Ocean App Platform] The starter plan (free) has 1 GB bandwidth per
  month, Professional 100 GB, and $0.10/GB for overage.

- [Netlify] Starter 100 GB, Pro 1 TB, and $55 per 100 GB for overage.

- [Vercel] Hobby 100 GB, Pro 1 TB, and contact the sale to buy additional
  bandwidth.

- [Gatsby] Free 100 GB, Professional 1 TB. Gatsby does not charge for overage,
  and they will contact the user if they continue to exceed bandwidth limits.

- [Render] 100 GB free, then $0.10 per GB.

- [Koyeb] 100 GB free, then $0.04 per GB (not charged yet).

- [Railway] 100 GB free for all the plans. Overage billing is not mentioned on
  their pricing page. And I suspect overage billing or throttling has not been
  implemented yet on their platform yet since I found this paragraph on their
  [documentation]:

  > Railway doesn't meter bandwidth within Projects and the broader internet. As
  > such, we have had projects handle unexpected traffic and features on major
  > media publications. It is something we are very proud of. ... We do have
  > plans to include private networking, static IPs, and allowing people to set
  > up firewall rules to control permitted traffic within their projects.

- [Fly] 100/30/30 GB free for North America & Europe / Other / India, then
  $0.02/$0.04/$0.12 per GB. The price for 1 TB listed in the table above assumes
  bandwidth from North America or Europe.

- [LeanCloud] offers a free trial instance with 1 GB free bandwidth per day,
  then $0.1/GB for overage. The price listed in the table above assumes the site
  exceeds the free quota every day and there are 30 days in month. The free
  trial instance will hibernate if it has run more than 18 hours in the past 24
  hours or no request is made in the past 30 minutes. The standard instance (no
  hibernation) costs $1.6 per day.

  BTW, bandwidth usage was [unmetered until Novermber 2019].

- [Heroku] The Hobby plan is the cheapest one, costing $7 per month. Bandwidth
  is [soft limited at 2 TB]. Overage bandwidth billing is not mentioned on their
  site.

- [GitHub Pages] is free and there is a soft bandwidth limit of 100 GB per
  month.

- [Cloudflare Pages] features [unlimited bandwidth]. Use it for serving video or
  a disproportionate percentage of pictures, audio files, or other non-HTML
  content is against their [terms] though.

- Both [Digital Ocean] and [Linode] includes 1 TB bandwidth for the cheapest VPS
  plan. Additional transfer is billed at $0.01 per GB.

[Digital Ocean App Platform]: https://www.digitalocean.com/pricing/app-platform "pricing"
[Netlify]: https://www.netlify.com/pricing/ "pricing"
[Vercel]: https://vercel.com/pricing "pricing"
[Gatsby]: https://www.gatsbyjs.com/pricing/ "pricing"
[Render]: https://render.com/pricing "pricing"
[Koyeb]: https://www.koyeb.com/docs/faqs/pricing#how-does-charging-for-outbound-bandwidth-work "charging for outbound bandwidth"
[Railway]: https://railway.app/pricing "pricing"
[documentation]: https://docs.railway.app/reference/usecases "Railway usecases"
[Fly]: https://fly.io/docs/about/pricing/ "pricing"
[LeanCloud]: https://leancloud.app/pricing "pricing"
[unmetered until Novermber 2019]: https://github.com/leancloud/docs-en/pull/107 "documentation update"
[Heroku]: https://devcenter.heroku.com/articles/usage-and-billing "pricing"
[soft limited at 2 TB]: https://devcenter.heroku.com/articles/limits#network "Heroku limits"
[GitHub Pages]: https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#usage-limits "usage limits"
[Cloudflare Pages]: https://pages.cloudflare.com/ "official site"
[unlimited bandwidth]: https://webmasters.stackexchange.com/questions/88659/how-can-cloudflare-offer-a-free-cdn-with-unlimited-bandwidth "Matthew Prince, Cloudflare Co-founder explains why offering free unlimited bandwidth"
[terms]: https://www.cloudflare.com/terms/ "2.8 Limitation on Serving Non-HTML Content"
[Digital Ocean]: https://docs.digitalocean.com/products/droplets/details/pricing/ "Droplet Pricing"
[Linode]: https://www.linode.com/docs/guides/network-transfer/ "Transfer Allowance"
