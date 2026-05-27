<template>
  <div class="psm-page-container psm-page-container--sub psm-page-container--contact-us">
    <section class="psm-hero">
      <div class="grid-container">
        <div class="row">
          <div class="col col-12 col-md-6 psm-hero__content">
            <h1 class="psm-hero__title">Contact Us</h1>
            <p class="psm-hero__description">
              eBL Korea 서비스 대해 궁금한 점이 있으신 경우,<br class="no-br--pc" />
              문의주시기 바랍니다.
              <br />
              확인 후 빠른 시간 내에 친절히 답변 드리겠습니다.
            </p>
          </div>
          <div class="col col-12 col-md-6 psm-hero__symbol">
            <img :src="heroObject" alt="Contact symbol" class="psm-hero__visual" />
          </div>
        </div>
      </div>
    </section>

    <section class="psm-section psm-contact-form-section">
      <div class="grid-container">
        <form class="psm-contact-form" @submit.prevent>
          <EblInfo vertical class="psm-contact-form__info">
            <div class="row psm-contact-form__row">
              <div class="col col-12 col-md-6">
                <EblInfoItem label="이름" required has-input>
                  <EblInput v-model="form.name" size="large" placeholder="이름을 입력해 주세요" />
                </EblInfoItem>
              </div>
              <div class="col col-12 col-md-6">
                <EblInfoItem label="이메일" required has-input>
                  <EblInput
                    v-model="form.email"
                    size="large"
                    placeholder="이메일을 입력해 주세요"
                  />
                </EblInfoItem>
              </div>
              <div class="col col-12 col-md-6">
                <EblInfoItem label="소속(회사)" required has-input>
                  <EblInput
                    v-model="form.company"
                    size="large"
                    placeholder="소속(회사)를 입력해 주세요"
                  />
                </EblInfoItem>
              </div>
              <div class="col col-12 col-md-6">
                <EblInfoItem label="문의 유형" required has-input>
                  <EblSelect
                    v-model="form.inquiryType"
                    :options="inquiryTypeOptions"
                    block
                    large
                    placeholder="선택"
                  />
                </EblInfoItem>
              </div>
              <div class="col col-12">
                <EblInfoItem label="문의 제목" required has-input>
                  <EblInput
                    v-model="form.subject"
                    size="large"
                    placeholder="소속(회사)를 입력해 주세요"
                  />
                </EblInfoItem>
              </div>
              <div class="col col-12">
                <EblInfoItem label="내용" required has-input>
                  <EblTextarea
                    v-model="form.content"
                    :rows="6"
                    placeholder="내용을 입력해 주세요"
                    error-message="Please complete this required field."
                  />
                </EblInfoItem>
              </div>
              <div class="col col-12">
                <EblInfoItem label="개인정보 수집 및 이용동의" required has-input>
                  <div class="psm-contact-form__policy-box">
                    샘플 약관 내용<br />
                    샘플 약관 내용<br />
                    샘플 약관 내용<br />
                    샘플 약관 내용<br />
                    샘플 약관 내용<br />
                    샘플 약관 내용<br />
                    샘플 약관 내용<br />
                    샘플 약관 내용<br />
                    샘플 약관 내용<br />
                    샘플 약관 내용<br />
                  </div>
                </EblInfoItem>
              </div>
              <div class="col col-12">
                <div class="psm-contact-form__agree-row">
                  <EblCheckbox v-model="form.agreed">필수 정보 제공에 동의함</EblCheckbox>
                </div>
              </div>
            </div>
          </EblInfo>

          <div class="psm-contact-form__actions">
            <EblBtn class="psm-contact-form__submit" color="tertiary" large>제출하기</EblBtn>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup>
import heroObject from '~/assets/images/portal/hero_contact_us.svg?url'

const inquiryTypeOptions = [
  { label: '선적', value: 'shipment' },
  { label: 'e-B/L 작성', value: 'bl' },
  { label: '기타', value: 'etc' },
]

const form = reactive({
  name: '',
  email: '',
  company: '',
  inquiryType: null,
  subject: '',
  content: '',
  agreed: true,
})

definePageMeta({ layout: 'portal' })
</script>
