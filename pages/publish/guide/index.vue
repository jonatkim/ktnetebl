<script setup>
definePageMeta({ layout: 'guide' })
const router = useRouter()
onMounted(() => {
  router.replace('/publish/guide/dashboard')
})
</script>
