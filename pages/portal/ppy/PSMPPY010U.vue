<template>
  <div class="psm-page-container psm-page-container--sub psm-page-container--privacy-policy">
    <section class="psm-section psm-privacy-policy-section">
      <div class="grid-container">
        <div class="psm-privacy-policy__head">
          <h1 class="psm-privacy-policy__title">개인정보처리방침</h1>
          <div class="psm-privacy-policy__version">
            <EblSelect
              v-model="selectedVersion"
              :options="policyVersionOptions"
              block
              placeholder="시행일 선택"
            />
          </div>
        </div>

        <div class="psm-privacy-policy__content">
          <h3>1. 수집하는 개인정보의 항목 및 수집방법</h3>
          <p>
            회사는 회원가입, 원활한 고객상담, 각종 서비스 제공 등을 위해 최초 회원가입 당시 아래와
            같은 개인정보를 수집하고 있습니다.<br />
            수입·이용 목적: KTNET Plus 이용 및 가입br /> 필수항목: 성명, 이메일, 아이디, 밀번호<br />
            선택항목: 휴대폰번호 닉네임<br />
            자동 수집항목<br />
            이용자의 브라우저 종류 및 OS, 검색어, IP Addres, 쿠키<br />
            회사는 다음과 같은 방법로 개인정보를 수집합니다.<br />
            개인정보 수집방법<br />
            홈페이지, 서면양식, 팩스,전화, 상담게시판, 이메일<br />
            협력회사로부터의 제공<br />
            생성정보 수집 툴을 통한 수집
          </p>
          <h3>2. 개인정보의 수집 및 이용목적</h3>
          <p>
            회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.<br />
            회원 관리<br />
            회원제 서비스 이용에 따른 본인확인, 개인식별, 불량회원의 부정 이용방지와 비인가
            사용방지, 가입의사 확인, 분쟁조정을 위한 기록보존, 불만처리 등 민원처리, 고지사항
            전달<br />
            서비스 제공에 관한 계약이행 및 서비스 제공에 따른 요금정산 특정 맞춤서비스 제공, 청구서
            등 발송, 본인인증, 요금결제 및 요금추심 전자무역 이용 설명회 안내, 신규 서비스 개발 및
            소개, 마케팅 및 광고에 활용 전자무역 이용 설명회 안내, 신규 서비스(제품) 개발 및 소개,
            통계학적 특성에 따른 서비스 제공, 특화, 이벤트 등 광고성 정보전달 및 참여기회 제공,
            서비스의 유효성 확인, 접속 빈도 파악 또는 회원의 서비스 이용에 대한 통계 상품이나 서비스
            매칭 중계시 거래 당사자 간 또는 거래 참여자들 상호간 정보 공유
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'portal' })
const policyVersionOptions = [
  { label: '2026.04.15', value: '2026-04-15' },
  { label: '2025.12.01', value: '2025-12-01' },
  { label: '2025.08.20', value: '2025-08-20' },
]

const selectedVersion = ref(policyVersionOptions[0].value)
</script>
