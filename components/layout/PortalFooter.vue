<template>
  <footer class="psm-footer">
    <div class="psm-footer__gradient-overlay" />
    <div class="psm-footer__img-overlay" />
    <div class="grid-container">
      <div class="row">
        <div class="col col-12 col-md-6">
          <div class="psm-footer__logo">
            <p>Approved by</p>
            <VImg
              :src="logoBottom"
              alt="IGP&I Logo"
              width="209"
              height="40"
              aspect-ratio="290/40"
            />
          </div>
          <div class="psm-footer__links">
            <NuxtLink :to="footerPolicyLinks.terms">Terms &amp; Conditions</NuxtLink>
            <span class="dot">&ZeroWidthSpace;</span>
            <NuxtLink :to="footerPolicyLinks.privacy">Privacy Policy</NuxtLink>
            <span class="dot">&ZeroWidthSpace;</span>
            <NuxtLink :to="footerPolicyLinks.copyright">Copyright Policy</NuxtLink>
          </div>
          <div class="psm-footer__copyright">
            &copy;2026 Copyright by KTNET.<br class="no-br--pc" />All rights reserved.
          </div>
        </div>
        <div class="col col-0 col-md-6">
          <div class="psm-footer__sitemap">
            <div class="sub">
              <h4 class="psm-footer__heading">Solutions</h4>
              <ul class="psm-footer__list">
                <li>
                  <NuxtLink :to="footerSitemap.solutions[0].to">{{
                    footerSitemap.solutions[0].label
                  }}</NuxtLink>
                </li>
                <li>
                  <NuxtLink :to="footerSitemap.solutions[1].to">{{
                    footerSitemap.solutions[1].label
                  }}</NuxtLink>
                </li>
                <li>
                  <NuxtLink :to="footerSitemap.solutions[2].to">{{
                    footerSitemap.solutions[2].label
                  }}</NuxtLink>
                </li>
                <li>
                  <NuxtLink :to="footerSitemap.solutions[3].to">{{
                    footerSitemap.solutions[3].label
                  }}</NuxtLink>
                </li>
              </ul>
            </div>
            <div class="sub">
              <h4 class="psm-footer__heading">Platform</h4>
              <ul class="psm-footer__list">
                <li>
                  <NuxtLink :to="footerSitemap.platform[0].to">{{
                    footerSitemap.platform[0].label
                  }}</NuxtLink>
                </li>
                <li>
                  <NuxtLink :to="footerSitemap.platform[1].to">{{
                    footerSitemap.platform[1].label
                  }}</NuxtLink>
                </li>
                <li>
                  <NuxtLink :to="footerSitemap.platform[2].to">{{
                    footerSitemap.platform[2].label
                  }}</NuxtLink>
                </li>
              </ul>
            </div>
            <div class="sub">
              <h4 class="psm-footer__heading">Resources</h4>
              <ul class="psm-footer__list">
                <li>
                  <NuxtLink :to="footerSitemap.resources[0].to">{{
                    footerSitemap.resources[0].label
                  }}</NuxtLink>
                </li>
                <li>
                  <NuxtLink :to="footerSitemap.resources[1].to">{{
                    footerSitemap.resources[1].label
                  }}</NuxtLink>
                </li>
              </ul>
            </div>
            <div class="sub">
              <h4 class="psm-footer__heading">Company</h4>
              <ul class="psm-footer__list">
                <li>
                  <NuxtLink :to="footerSitemap.company[0].to">{{
                    footerSitemap.company[0].label
                  }}</NuxtLink>
                </li>
                <li>
                  <NuxtLink :to="footerSitemap.company[1].to">{{
                    footerSitemap.company[1].label
                  }}</NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import logoBottom from '~/assets/images/portal/logo_bottom.svg?url'

const footerPolicyLinks = {
  terms: '/portal/sin/PSMSIN040U',
  privacy: '/portal/sin/PSMSIN020U',
  copyright: '/portal/sin/PSMSIN030U',
}

const footerSitemap = {
  solutions: [
    { label: 'Digital Axis', to: '/portal/sol/PSMSOL010U' },
    { label: 'Electronic B/L', to: '/portal/sol/PSMSOL020U' },
    { label: 'Negotiation', to: '/portal/sol/PSMSOL030U' },
    { label: 'Presentation', to: '/portal/sol/PSMSOL040U' },
  ],
  platform: [
    { label: 'Technology', to: '/portal/plt/PSMPLT010U' },
    { label: 'Security', to: '/portal/plt/PSMPLT020U' },
    { label: 'Industrial Standards', to: '/portal/plt/PSMPLT030U' },
  ],
  resources: [
    { label: 'FAQ', to: '/portal/rsc/PSMRSC010U' },
    { label: 'Tutorials', to: '/portal/rsc/PSMRSC020U' },
  ],
  company: [
    { label: 'About KTNET', to: '/portal/cpn/PSMCPN010U' },
    { label: 'Contact Us', to: '/portal/cpn/PSMCPN020U' },
  ],
}
</script>
