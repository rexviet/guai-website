const fs = require('fs');

const originalHtml = fs.readFileSync('../../kakao_home.html', 'utf8');

// I will write the index.astro content directly.
const content = `---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getServices, getCaseStudies } from '../lib/strapi-client';

const locale = 'vi';
const services = await getServices(locale);
const caseStudies = await getCaseStudies(locale);

const bannerVideo = "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64ae84a2fd7e81e18cc7150f_pexels shvets production 7547007 2160p-transcode.mp4";
const bannerPoster = "https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64ae84a2fd7e81e18cc7150f_pexels shvets production 7547007 2160p-poster-00001.jpg";
---

<BaseLayout
  lang={locale}
  seo={{
    metaTitle: "GuAI Studio - Sáng tạo nội dung với AI",
    metaDescription: "GuAI Studio cung cấp các giải pháp sáng tạo nội dung mạnh mẽ dựa trên công nghệ AI."
  }}
>
  <!-- Hero Section -->
  <div data-w-id="bd1cbc60-077b-0eeb-98c4-c170d090ec19" class="home-1-section">
    <div class="parallax-video-banner">
      <figure id="BG-video" class="home-1-video w-node-bd1cbc60-077b-0eeb-98c4-c170d090ec1d-50f20c2b w-background-video w-background-video-atom">
        <video autoplay loop muted playsinline style={\`background-image:url("\${bannerPoster}")\`} data-object-fit="cover">
          <source src={bannerVideo} />
        </video>
        <div class="banner-video-ov"></div>
      </figure>
    </div>
    <div id="w-node-bd1cbc60-077b-0eeb-98c4-c170d090ec1f-50f20c2b" class="video-ov-banner">
      <div class="base-container">
        <div class="home-hero-content">
          <div class="home-1-hero-title">
            <h1 data-w-id="44e490e8-94df-d6fc-c177-03801ee8f206" style="opacity:0" class="title-home-1">Your video world</h1>
            <p data-w-id="30ca54f6-73ed-1f90-e7e1-36feec46e296" style="opacity:0" class="banner-long-description">
              Welcome to GuAI Studio, the ultimate platform designed to elevate your entertainment experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Services Section -->
  <section id="Our-Benefits" class="section">
    <div class="grid-wrapper">
      <div id="w-node-_6eed7597-876c-9219-30fa-00dd96ea70fd-50f20c2b" data-w-id="6eed7597-876c-9219-30fa-00dd96ea70fd" class="four-column">
        <h6 class="h6-subtitle">/Our Services</h6>
        <div id="w-node-_295f2ac4-6769-314c-6f13-d8c57377d109-50f20c2b" class="flex-container">
          <div class="about-us-left-con">
            <div class="left-info">
              <div class="text-animation-wrapper">
                <h2 data-w-id="295f2ac4-6769-314c-6f13-d8c57377d10f" style="opacity:0" class="text-animation">all your video content needs! Let's create!</h2>
              </div>
            </div>
            <div data-w-id="295f2ac4-6769-314c-6f13-d8c57377d111" style="opacity:0" class="right-arrow-wrap">
              <div class="load-3">
                <a href="#recent-work" class="btn-circle w-inline-block">
                  <div class="clip">
                    <div class="button-icon"><img src="https://cdn.prod.website-files.com/648aca18f05d659650f20acc/648c021d480360c9daeee454_Vector%206.webp" loading="lazy" alt="Project icon" class="icon-bottom" /></div>
                    <div class="button-icon button-icon-top"><img src="https://cdn.prod.website-files.com/648aca18f05d659650f20acc/648c021d480360c9daeee454_Vector%206.webp" loading="lazy" alt="Project icon" class="icon-bottom" /></div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div class="advantages-wrap">
            <div data-w-id="295f2ac4-6769-314c-6f13-d8c57377d11a" style="width:0%" class="top-line-advantages"></div>
            <div data-w-id="295f2ac4-6769-314c-6f13-d8c57377d11b" style="opacity:0" class="advantages-list">
              <a href={\`/services/\${services[0]?.slug}\`} id="w-node-df6ce8cb-439e-de31-1da6-3751b435b23a-50f20c2b" class="mini-video-lightbox w-inline-block">
                <div data-w-id="295f2ac4-6769-314c-6f13-d8c57377d11c" class="methods-container">
                  <div class="service-video-wrap">
                    <div class="video-services w-background-video w-background-video-atom">
                      <video autoplay loop muted playsinline style={\`background-image:url("\${services[0]?.featured_image?.url || bannerPoster}")\`} data-object-fit="cover">
                        {services[0]?.featured_image?.url && <source src={services[0]?.featured_image?.url} />}
                      </video>
                    </div>
                  </div>
                  <div class="metods-content-card">
                    <div class="services-top"><h4 class="methods-title">{services[0]?.title}</h4></div>
                    <p class="methods-text">{services[0]?.short_description}<br /></p>
                  </div>
                </div>
              </a>
              <a href={\`/services/\${services[1]?.slug}\`} id="w-node-_001034bc-a625-d06b-8bef-c1341427cf02-50f20c2b" class="mini-video-lightbox w-inline-block">
                <div class="methods-container">
                  <div class="metods-content-card">
                    <div class="services-top"><h4 class="methods-title">{services[1]?.title}</h4></div>
                    <p class="methods-text">{services[1]?.short_description}<br /></p>
                  </div>
                  <div class="service-video-wrap">
                    <div class="video-services w-background-video w-background-video-atom">
                      <video autoplay loop muted playsinline style={\`background-image:url("\${services[1]?.featured_image?.url || bannerPoster}")\`} data-object-fit="cover">
                        {services[1]?.featured_image?.url && <source src={services[1]?.featured_image?.url} />}
                      </video>
                    </div>
                  </div>
                </div>
              </a>
              <a href={\`/services/\${services[2]?.slug}\`} id="w-node-_4b42da0d-52b6-b48d-9644-74c6d7a51ccc-50f20c2b" class="mini-video-lightbox w-inline-block">
                <div class="methods-container">
                  <div class="metods-content-card">
                    <div class="services-top"><h4 class="methods-title">{services[2]?.title}</h4></div>
                    <p class="methods-text">{services[2]?.short_description}<br /></p>
                  </div>
                  <div class="service-video-wrap">
                    <div class="video-services w-background-video w-background-video-atom">
                      <video autoplay loop muted playsinline style={\`background-image:url("\${services[2]?.featured_image?.url || bannerPoster}")\`} data-object-fit="cover">
                        {services[2]?.featured_image?.url && <source src={services[2]?.featured_image?.url} />}
                      </video>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Works Section -->
  <section id="recent-work" class="section without-top-spacing">
    <div class="best-recent-work-wrapper">
      <div data-w-id="41adf324-56a4-046a-b606-9aedb502ab91" style="opacity:0" class="recent-work-grid">
        <div id="w-node-_41adf324-56a4-046a-b606-9aedb502ab92-50f20c2b" class="sticky-image-bar">
          <div id="w-node-_41adf324-56a4-046a-b606-9aedb502ab93-50f20c2b" class="sticky-image-box">
            <div class="sticky-image">
              <div data-w-id="1a820061-e62d-316c-d03a-565301540620" style="display:flex" class="column-animations">
                <div data-ix="color-bar-1" style="height:100%" class="top-color"></div>
              </div>
              <div class="sticky-image-wrapper image-three">
                <article class="best-video-work w-background-video w-background-video-atom">
                  <video autoplay loop muted playsinline style={\`background-image:url("\${caseStudies[0]?.thumbnail?.url || bannerPoster}")\`} data-object-fit="cover">
                    {caseStudies[0]?.thumbnail?.url && <source src={caseStudies[0]?.thumbnail?.url} />}
                  </video>
                </article>
              </div>
              <div class="sticky-image-wrapper image-two">
                <div class="best-video-work w-background-video w-background-video-atom">
                  <video autoplay loop muted playsinline style={\`background-image:url("\${caseStudies[1]?.thumbnail?.url || bannerPoster}")\`} data-object-fit="cover">
                    {caseStudies[1]?.thumbnail?.url && <source src={caseStudies[1]?.thumbnail?.url} />}
                  </video>
                </div>
              </div>
              <div class="sticky-image-wrapper image-one">
                <div class="best-video-work w-background-video w-background-video-atom">
                  <video autoplay loop muted playsinline style={\`background-image:url("\${caseStudies[2]?.thumbnail?.url || bannerPoster}")\`} data-object-fit="cover">
                    {caseStudies[2]?.thumbnail?.url && <source src={caseStudies[2]?.thumbnail?.url} />}
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="w-node-_41adf324-56a4-046a-b606-9aedb502aba3-50f20c2b" class="sticky-box-list">
          <div class="intro-box">
            <div class="stacked-info">
              <div class="stacked-info-wrap">
                <div class="top-title-con">
                  <h6 class="best-work">/Best recent work</h6>
                  <h2 class="best-work-title">{caseStudies[0]?.title}</h2>
                </div>
                <div class="mobile-intro-box-image">
                  <div class="sticky-image-wrapper image-one">
                    <div class="best-video-work w-background-video w-background-video-atom">
                      <video autoplay loop muted playsinline style={\`background-image:url("\${caseStudies[0]?.thumbnail?.url || bannerPoster}")\`} data-object-fit="cover">
                        {caseStudies[0]?.thumbnail?.url && <source src={caseStudies[0]?.thumbnail?.url} />}
                      </video>
                    </div>
                  </div>
                  <a href={\`/work/\${caseStudies[0]?.slug}\`} class="best-work-link-wrap w-inline-block">
                    <div class="view-link-best-work"><h6 class="view-more">View</h6></div>
                  </a>
                </div>
                <p id="w-node-_41adf324-56a4-046a-b606-9aedb502abae-50f20c2b" class="services-description">{caseStudies[0]?.summary}</p>
              </div>
              <div class="transparent-btn-wrapper">
                <a href={\`/work/\${caseStudies[0]?.slug}\`} class="button-transparent w-inline-block">
                  <div class="clip">
                    <div class="btn-banner-text"><div class="btn-title-text">Learn More</div></div>
                    <div class="btn-banner-text button-text-bottom"><div class="btn-title-text">Learn More</div></div>
                  </div>
                  <div class="clip">
                    <div class="button-icon"><img src="https://cdn.prod.website-files.com/648aca18f05d659650f20acc/648c021d480360c9daeee454_Vector%206.webp" loading="lazy" alt="Project icon" class="icon-top" /></div>
                    <div class="button-icon button-icon-bottom"><img src="https://cdn.prod.website-files.com/648aca18f05d659650f20acc/648c021d480360c9daeee454_Vector%206.webp" loading="lazy" alt="Project icon" class="icon-top" /></div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div class="intro-box">
            <div class="stacked-info">
              <div class="stacked-info-wrap">
                <div class="top-title-con">
                  <h6 class="best-work">/Best recent work</h6>
                  <h2 class="best-work-title">{caseStudies[1]?.title}</h2>
                </div>
                <div class="mobile-intro-box-image">
                  <div class="sticky-image-wrapper image-two">
                    <div class="best-video-work w-background-video w-background-video-atom">
                      <video autoplay loop muted playsinline style={\`background-image:url("\${caseStudies[1]?.thumbnail?.url || bannerPoster}")\`} data-object-fit="cover">
                        {caseStudies[1]?.thumbnail?.url && <source src={caseStudies[1]?.thumbnail?.url} />}
                      </video>
                      <div data-w-id="51e864f6-7fc4-b27c-01f6-3f9d1c0c28b3" style="display:flex" class="column-animations">
                        <div data-ix="color-bar-1" style="height:100%" class="top-color"></div>
                      </div>
                    </div>
                  </div>
                  <a data-w-id="0cadff4d-d9a5-3e11-72df-a147b5ebb332" href={\`/work/\${caseStudies[1]?.slug}\`} class="best-work-link-wrap w-inline-block">
                    <div class="view-link-best-work"><h6 class="view-more">View</h6></div>
                  </a>
                </div>
                <p id="w-node-_41adf324-56a4-046a-b606-9aedb502abbd-50f20c2b" class="services-description">{caseStudies[1]?.summary}</p>
              </div>
              <div class="transparent-btn-wrapper">
                <a href={\`/work/\${caseStudies[1]?.slug}\`} class="button-transparent w-inline-block">
                  <div class="clip">
                    <div class="btn-banner-text"><div class="btn-title-text">Learn More</div></div>
                    <div class="btn-banner-text button-text-bottom"><div class="btn-title-text">Learn More</div></div>
                  </div>
                  <div class="clip">
                    <div class="button-icon"><img src="https://cdn.prod.website-files.com/648aca18f05d659650f20acc/648c021d480360c9daeee454_Vector%206.webp" loading="lazy" alt="Project icon" class="icon-top" /></div>
                    <div class="button-icon button-icon-bottom"><img src="https://cdn.prod.website-files.com/648aca18f05d659650f20acc/648c021d480360c9daeee454_Vector%206.webp" loading="lazy" alt="Project icon" class="icon-top" /></div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div class="intro-box">
            <div class="stacked-info">
              <div class="stacked-info-wrap">
                <div class="top-title-con">
                  <h6 class="best-work">/Best recent work</h6>
                  <h2 class="best-work-title">{caseStudies[2]?.title}</h2>
                </div>
                <div class="mobile-intro-box-image">
                  <div class="sticky-image-wrapper image-three">
                    <div class="best-video-work w-background-video w-background-video-atom">
                      <video autoplay loop muted playsinline style={\`background-image:url("\${caseStudies[2]?.thumbnail?.url || bannerPoster}")\`} data-object-fit="cover">
                        {caseStudies[2]?.thumbnail?.url && <source src={caseStudies[2]?.thumbnail?.url} />}
                      </video>
                      <div data-w-id="90e6484f-1c6f-3102-89da-51e7ed6bc913" style="display:flex" class="column-animations">
                        <div data-ix="color-bar-1" style="height:100%" class="top-color"></div>
                      </div>
                    </div>
                  </div>
                  <a href={\`/work/\${caseStudies[2]?.slug}\`} class="best-work-link-wrap w-inline-block">
                    <div class="view-link-best-work"><h6 class="view-more">View</h6></div>
                  </a>
                </div>
                <p id="w-node-_41adf324-56a4-046a-b606-9aedb502abcc-50f20c2b" class="services-description">{caseStudies[2]?.summary}</p>
              </div>
              <div class="transparent-btn-wrapper">
                <a href={\`/work/\${caseStudies[2]?.slug}\`} class="button-transparent w-inline-block">
                  <div class="clip">
                    <div class="btn-banner-text"><div class="btn-title-text">Learn More</div></div>
                    <div class="btn-banner-text button-text-bottom"><div class="btn-title-text">Learn More</div></div>
                  </div>
                  <div class="clip">
                    <div class="button-icon"><img src="https://cdn.prod.website-files.com/648aca18f05d659650f20acc/648c021d480360c9daeee454_Vector%206.webp" loading="lazy" alt="Project icon" class="icon-top" /></div>
                    <div class="button-icon button-icon-bottom"><img src="https://cdn.prod.website-files.com/648aca18f05d659650f20acc/648c021d480360c9daeee454_Vector%206.webp" loading="lazy" alt="Project icon" class="icon-top" /></div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Final CTA Video Section -->
  <div data-w-id="92dba6dd-f1b4-079e-312a-4872224e3139" class="video-section">
    <div class="video-large w-background-video w-background-video-atom">
      <video autoplay loop muted playsinline style={\`background-image:url("https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959fae3c43f45d2db99e4e_pexels marian croitoru 4524595 1920x1080 25fps 1-poster-00001.jpg")\`} data-object-fit="cover">
        <source src="https://cdn.prod.website-files.com/648aca18f05d659650f20acc/64959fae3c43f45d2db99e4e_pexels marian croitoru 4524595 1920x1080 25fps 1-transcode.mp4" />
      </video>
      <div class="img-overlay">
        <div class="base-video-container">
          <h2 data-w-id="bc01e66f-1ae7-85fd-6d81-f7f02352d933" style="opacity:0" class="video-info-content">Get ready to go on an amazing adventure!<br></h2>
          <div id="w-node-bc01e66f-1ae7-85fd-6d81-f7f02352d939-50f20c2b" data-w-id="bc01e66f-1ae7-85fd-6d81-f7f02352d939" style="opacity:0" class="hero-video-wrapper-2">
            <div class="vertical-video-line top"></div>
            <a href="/contact" class="video-button w-inline-block" style="text-decoration: none;">
              <div class="play-button-icon-2" style="font-family: inherit; font-size: 1rem; width: auto; padding: 0 30px;">Contact Us</div>
            </a>
            <div class="vertical-video-line bottom-max"></div>
          </div>
        </div>
      </div>
      <div data-w-id="56bab206-c8b9-5c67-8e2a-038b0cc9f8b9" style="display:flex" class="column-animations">
        <div data-ix="color-bar-1" style="height:100%" class="top-color"></div>
      </div>
    </div>
  </div>

</BaseLayout>
`;

fs.writeFileSync('../src/pages/index.astro', content);
console.log('Successfully wrote index.astro');
