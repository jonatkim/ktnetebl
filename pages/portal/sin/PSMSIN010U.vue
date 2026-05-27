<template>
  <div class="psm-account-container">
    <div class="psm-account-card psm-account-card--signin">
      <div class="psm-account-card__top">
        <div class="psm-account-card__logo-wrapper">
          <VImg
            src="~/assets/images/common/eblk.svg?url"
            alt="eblk"
            :max-width="160"
            class="psm-account-card__logo"
          />
        </div>
      </div>
      <div class="psm-account-card__header">
        <h1>Sign in</h1>
      </div>
      <div class="psm-account-card__body">
        <EblInfo vertical class="psm-account-form">
          <EblInfoItem label="ID" has-input>
            <EblInput v-model="form.id" placeholder="Enter your ID (E-mail)" />
          </EblInfoItem>

          <EblInfoItem label="Password" has-input>
            <EblInput
              v-model="form.password"
              placeholder="Input a Password"
              :type="showPassword ? 'text' : 'password'"
            >
              <template #append>
                <EblBtn
                  :icon="showPassword ? 'ebli:eye-open' : 'ebli:eye-close'"
                  size="x-small"
                  color="ghost"
                  @click="showPassword = !showPassword"
                />
              </template>
            </EblInput>
          </EblInfoItem>
        </EblInfo>
        <div v-if="isMobile" class="psm-account-form__options">
          <EblCheckbox v-model="form.autoLogin">Auto Login</EblCheckbox>
        </div>
        <div class="psm-account-form__error-message">
          로그인 시도 횟수 초과로 계정이 일시 잠금되었습니다.<br />
          5분 후 다시 로그인이 가능합니다.
        </div>
      </div>
      <div class="psm-account-card__footer">
        <EblBtn color="cta" large block :disabled="!isFormValid" class="psm-account-form__submit"
          >Sign in</EblBtn
        >
        <div class="psm-account-form__options util">
          <EblBtn color="ghost" :small="isMobile">Forgot ID?</EblBtn>
          <VDivider vertical length="14" class="mx-1" />
          <EblBtn color="ghost" :small="isMobile">Reset Password</EblBtn>
        </div>
        <VDivider class="my-6" />
        <p v-if="isMobile" class="psm-account-card__register-mobile">
          Registration is only available on DeskTop Web.
        </p>
        <p v-else class="psm-account-card__register-desktop">
          Don&rsquo;t have an account?&nbsp;
          <NuxtLink to="#" class="psm-account-form__link">Register</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'

definePageMeta({ layout: 'blank' })

const { smAndDown } = useDisplay()
const isMobile = smAndDown

const form = reactive({
  id: '',
  password: '',
  autoLogin: false,
})

const showPassword = ref(false)

const isFormValid = computed(() => form.id.trim() && form.password.trim())
</script>
