<script setup>
// error.vue 렌더링을 확인하기 위한 임시 500 테스트 페이지
// createError()로 Nuxt 에러 객체를 만들고 throw 하면 현재 페이지 대신 error.vue가 렌더링된다.
throw createError({
  statusCode: 500,
  statusMessage: 'Internal Server Error',
  message: '테스트용 500 에러 페이지입니다.',
})
</script>
