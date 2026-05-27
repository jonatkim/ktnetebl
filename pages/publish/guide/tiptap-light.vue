<template>
  <div class="editor-page">
    <section class="editor-card">
      <header class="editor-header">
        <h1>Tiptap Light</h1>
        <p>현재 프로젝트에서 무리 없이 붙는 범위로 구성한 경량 에디터 예시입니다.</p>
      </header>

      <div v-if="editor" class="editor-shell">
        <div class="toolbar">
          <button
            type="button"
            :class="{ 'is-active': editor.isActive('bold') }"
            @click="editor.chain().focus().toggleBold().run()"
          >
            Bold
          </button>
          <button
            type="button"
            :class="{ 'is-active': editor.isActive('italic') }"
            @click="editor.chain().focus().toggleItalic().run()"
          >
            Italic
          </button>
          <button
            type="button"
            :class="{ 'is-active': editor.isActive('underline') }"
            @click="editor.chain().focus().toggleUnderline().run()"
          >
            Underline
          </button>
          <button
            type="button"
            :class="{ 'is-active': editor.isActive('strike') }"
            @click="editor.chain().focus().toggleStrike().run()"
          >
            Strike
          </button>
          <button
            type="button"
            :class="{ 'is-active': editor.isActive('textStyle', { fontSize: '14px' }) }"
            @click="setFontSize('14px')"
          >
            Small
          </button>
          <button
            type="button"
            :class="{ 'is-active': editor.isActive('textStyle', { fontSize: '16px' }) }"
            @click="setFontSize('16px')"
          >
            Base
          </button>
          <button
            type="button"
            :class="{ 'is-active': editor.isActive('textStyle', { fontSize: '20px' }) }"
            @click="setFontSize('20px')"
          >
            Large
          </button>
          <button
            type="button"
            :class="{ 'is-active': editor.isActive('textStyle', { color: '#c2410c' }) }"
            @click="setTextColor('#c2410c')"
          >
            Orange
          </button>
          <button
            type="button"
            :class="{ 'is-active': editor.isActive('textStyle', { color: '#0f766e' }) }"
            @click="setTextColor('#0f766e')"
          >
            Teal
          </button>
          <button
            type="button"
            :class="{ 'is-active': editor.isActive('textStyle', { color: '#1d4ed8' }) }"
            @click="setTextColor('#1d4ed8')"
          >
            Blue
          </button>
          <button type="button" @click="clearTextStyle">Clear style</button>
          <button
            type="button"
            :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          >
            H1
          </button>
          <button
            type="button"
            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
            @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          >
            H2
          </button>
          <button
            type="button"
            :class="{ 'is-active': editor.isActive('bulletList') }"
            @click="editor.chain().focus().toggleBulletList().run()"
          >
            Bullet
          </button>
          <button
            type="button"
            :class="{ 'is-active': editor.isActive('orderedList') }"
            @click="editor.chain().focus().toggleOrderedList().run()"
          >
            Ordered
          </button>
          <button
            type="button"
            :class="{ 'is-active': editor.isActive('blockquote') }"
            @click="editor.chain().focus().toggleBlockquote().run()"
          >
            Quote
          </button>
          <button
            type="button"
            :class="{ 'is-active': editor.isActive('codeBlock') }"
            @click="editor.chain().focus().toggleCodeBlock().run()"
          >
            Code
          </button>
          <button type="button" @click="setLink">Link</button>
          <button type="button" @click="editor.chain().focus().unsetLink().run()">Unlink</button>
          <button type="button" @click="setImage">Image</button>
          <button type="button" @click="editor.chain().focus().setHorizontalRule().run()">HR</button>
          <button type="button" @click="editor.chain().focus().setHardBreak().run()">Break</button>
          <button
            type="button"
            :disabled="!editor.can().chain().focus().undo().run()"
            @click="editor.chain().focus().undo().run()"
          >
            Undo
          </button>
          <button
            type="button"
            :disabled="!editor.can().chain().focus().redo().run()"
            @click="editor.chain().focus().redo().run()"
          >
            Redo
          </button>
        </div>

        <EditorContent :editor="editor" />
      </div>

      <section class="benchmark-section">
        <div class="benchmark-header">
          <h2>Editor Benchmark</h2>
          <p>현재 프로젝트 기준으로 동일 조건에서 측정한 비교 기록입니다.</p>
        </div>

        <div class="benchmark-table-wrap">
          <table class="benchmark-table">
            <thead>
              <tr>
                <th>항목</th>
                <th>웹에디터 없음</th>
                <th>CKEditor 기본 빌드</th>
                <th>CKEditor 선택 플러그인 빌드</th>
                <th>Tiptap 에디터</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>상태 설명</strong>
                  <small>어떤 에디터 방식을 사용한 상태인지 간단히 적는 칸</small>
                </td>
                <td>등록 다이얼로그의 <code>Message</code>에 <code>EblTextarea</code> 사용</td>
                <td>등록 다이얼로그의 <code>Message</code>에 <code>@ckeditor/ckeditor5-build-classic</code> 사용</td>
                <td><code>ckeditor5</code> 기반 경량 구성 사용</td>
                <td><code>Tiptap</code> 기반 경량 구성 사용</td>
              </tr>
              <tr>
                <td>
                  <strong>설치 시간 (<code>npm ci</code>)</strong>
                  <small>의존성을 새로 설치하는 데 걸린 시간</small>
                </td>
                <td><code>11s</code></td>
                <td class="metric-worst"><code>2m</code></td>
                <td><code>59s</code></td>
                <td><code>17s</code></td>
              </tr>
              <tr>
                <td>
                  <strong>전체 빌드 시간</strong>
                  <small><code>npm run build</code> 전체 실행 완료까지 걸린 시간</small>
                </td>
                <td><code>50.68s</code></td>
                <td><code>103.85s</code></td>
                <td class="metric-worst"><code>149.02s</code></td>
                <td><code>80.45s</code></td>
              </tr>
              <tr>
                <td>
                  <strong>클라이언트 빌드 시간</strong>
                  <small>Nuxt 로그 기준 클라이언트 번들 생성 시간</small>
                </td>
                <td><code>40.34s</code></td>
                <td><code>86.86s</code></td>
                <td class="metric-worst"><code>132.41s</code></td>
                <td><code>65.512s</code></td>
              </tr>
              <tr>
                <td>
                  <strong>변환된 모듈 수</strong>
                  <small>빌드 과정에서 변환된 전체 모듈 수</small>
                </td>
                <td><code>2486</code></td>
                <td><code>3131</code></td>
                <td class="metric-worst"><code>17931</code></td>
                <td><code>2599</code></td>
              </tr>
              <tr>
                <td>
                  <strong><code>node_modules</code> 전체 용량</strong>
                  <small>프로젝트 전체 의존성 설치 용량</small>
                </td>
                <td><code>537M</code></td>
                <td class="metric-worst"><code>3.2G</code></td>
                <td><code>754M</code></td>
                <td><code>558M</code></td>
              </tr>
              <tr>
                <td>
                  <strong>에디터 관련 패키지 용량</strong>
                  <small>에디터와 직접 관련된 패키지들이 차지하는 용량</small>
                </td>
                <td><code>0B</code></td>
                <td class="metric-worst"><code>2.5G</code></td>
                <td><code>196M</code></td>
                <td><code>6.8M</code></td>
              </tr>
              <tr>
                <td>
                  <strong>에디터 관련 파일 수</strong>
                  <small>에디터 패키지 내부 파일 개수</small>
                </td>
                <td><code>0</code></td>
                <td class="metric-worst"><code>220,045</code></td>
                <td><code>29,543</code></td>
                <td><code>1,036</code></td>
              </tr>
              <tr>
                <td>
                  <strong><code>.nuxt/dist/client</code> 크기</strong>
                  <small>클라이언트 빌드 결과물 전체 크기</small>
                </td>
                <td><code>47M</code></td>
                <td><code>48M</code></td>
                <td><code>48M</code></td>
                <td class="metric-worst"><code>53M</code></td>
              </tr>
              <tr>
                <td>
                  <strong><code>.output/public</code> 크기</strong>
                  <small>배포용 정적 파일 전체 크기</small>
                </td>
                <td><code>54M</code></td>
                <td class="metric-worst"><code>56M</code></td>
                <td><code>55M</code></td>
                <td class="metric-best"><code>54M</code></td>
              </tr>
              <tr>
                <td>
                  <strong><code>.output/server</code> 크기</strong>
                  <small>서버 번들 결과물 전체 크기</small>
                </td>
                <td><code>3.5M</code></td>
                <td><code>3.5M</code></td>
                <td><code>3.5M</code></td>
                <td><code>3.5M</code></td>
              </tr>
              <tr>
                <td>
                  <strong>가장 큰 JS 파일 크기</strong>
                  <small>빌드 결과 중 가장 큰 자바스크립트 파일 크기</small>
                </td>
                <td><code>3.4M</code></td>
                <td class="metric-best"><code>3.4M</code></td>
                <td class="metric-best"><code>3.4M</code></td>
                <td class="metric-worst"><code>3.5M</code></td>
              </tr>
              <tr>
                <td>
                  <strong>가장 큰 CSS 파일 크기</strong>
                  <small>빌드 결과 중 가장 큰 CSS 파일 크기</small>
                </td>
                <td><code>1.1M</code></td>
                <td class="metric-best"><code>1.1M</code></td>
                <td class="metric-best"><code>1.1M</code></td>
                <td class="metric-worst"><code>1.2M</code></td>
              </tr>
              <tr>
                <td>
                  <strong>비고</strong>
                  <small>측정 당시 특이사항이나 참고 메모</small>
                </td>
                <td>기준점 상태</td>
                <td>용량은 매우 큼</td>
                <td>용량은 줄었지만 빌드 성능은 가장 나쁨</td>
                <td>기능을 늘려도 용량과 빌드 성능이 비교적 균형적</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup>
import Color from '@tiptap/extension-color'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const editor = ref(null)

const initialContent = `
  <h2>Q&amp;A Message Sample</h2>
  <p>
    현재 프로젝트에서 필요한 수준으로 문단, 강조, 링크, 리스트 정도를 중심으로 구성한 예시입니다.
  </p>
  <ul>
    <li>굵게, 기울임, 밑줄</li>
    <li>제목, 목록, 인용문</li>
    <li>코드 블록, 링크, 이미지</li>
    <li>텍스트 색상과 글자 크기</li>
  </ul>
  <p>링크와 이미지는 버튼을 누른 뒤 주소를 입력하면 됩니다.</p>
`

const setFontSize = (fontSize) => {
  editor.value?.chain().focus().setMark('textStyle', { fontSize }).run()
}

const setTextColor = (color) => {
  editor.value?.chain().focus().setColor(color).run()
}

const clearTextStyle = () => {
  if (!editor.value) {
    return
  }

  editor.value.chain().focus().unsetColor().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run()
}

const setLink = () => {
  if (!editor.value) {
    return
  }

  const previousUrl = editor.value.getAttributes('link').href || ''
  const url = window.prompt('링크 주소를 입력하세요.', previousUrl)

  if (url === null) {
    return
  }

  if (!url.trim()) {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
}

const setImage = () => {
  if (!editor.value) {
    return
  }

  const url = window.prompt('이미지 주소를 입력하세요.')

  if (!url || !url.trim()) {
    return
  }

  editor.value.chain().focus().setImage({ src: url.trim(), alt: 'Inserted image' }).run()
}

onMounted(() => {
  editor.value = new Editor({
    content: initialContent,
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      Image.configure({
        inline: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
    ],
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped lang="scss">
.editor-page {
  padding: 32px;
}

.editor-card {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
  border: 1px solid #d9dee8;
  border-radius: 16px;
  background: #fff;
}

.benchmark-section {
  margin-top: 40px;
  padding-top: 28px;
  border-top: 1px solid #e5eaf1;
}

.benchmark-header {
  margin-bottom: 16px;

  h2 {
    margin: 0 0 6px;
    font-size: 22px;
    font-weight: 700;
  }

  p {
    margin: 0;
    font-size: 13px;
    color: #7a8696;
  }
}

.benchmark-table-wrap {
  overflow-x: auto;
  border: 1px solid #e0e6ee;
  border-radius: 14px;
}

.benchmark-table {
  width: 100%;
  min-width: 1100px;
  border-collapse: collapse;
  background: #fff;

  th,
  td {
    padding: 12px 14px;
    border-bottom: 1px solid #edf1f5;
    text-align: left;
    vertical-align: top;
  }

  thead th {
    background: #f7f9fc;
    color: #243041;
    font-size: 15px;
    font-weight: 700;
    white-space: nowrap;
  }

  tbody td {
    font-size: 14px;
    color: #728092;
    line-height: 1.6;
  }

  tbody td:first-child {
    color: #344256;
    font-weight: 600;
    min-width: 240px;
  }

  tbody td:first-child strong {
    display: block;
    margin-bottom: 4px;
    font-size: 14px;
    color: #243041;
    font-weight: 700;
  }

  tbody td:first-child small {
    display: block;
    font-size: 12px;
    line-height: 1.5;
    color: #8a97a8;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  code {
    font-size: 13px;
    color: #5f6c7c;
    background: #f3f6fa;
    padding: 2px 5px;
    border-radius: 5px;
  }
}

.benchmark-table td.metric-best {
  color: #166534;

  code {
    color: #166534;
    background: #ecfdf3;
  }
}

.benchmark-table td.metric-worst {
  color: #b42318;

  code {
    color: #b42318;
    background: #fef3f2;
  }
}

.editor-header {
  margin-bottom: 20px;

  h1 {
    margin: 0 0 8px;
    font-size: 28px;
    font-weight: 700;
  }

  p {
    margin: 0;
    color: #5f6b7a;
  }
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;

  button {
    padding: 8px 12px;
    border: 1px solid #cfd8e3;
    border-radius: 8px;
    background: #f7f9fc;
    color: #243041;
    font-size: 14px;
    cursor: pointer;
  }

  button.is-active {
    border-color: #0f6cbd;
    background: #e6f1fb;
    color: #0f4f87;
  }

  button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
}

:deep(.ProseMirror) {
  min-height: 320px;
  padding: 16px;
  border: 1px solid #cfd8e3;
  border-radius: 12px;
  outline: none;
  line-height: 1.7;
}

:deep(.ProseMirror p:first-child) {
  margin-top: 0;
}

:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
  padding-left: 20px;
}

:deep(.ProseMirror blockquote) {
  margin: 16px 0;
  padding-left: 12px;
  border-left: 4px solid #d7e7f8;
  color: #4a5a6a;
}

:deep(.ProseMirror pre) {
  padding: 12px 16px;
  border-radius: 10px;
  background: #1b2430;
  color: #f5f7fa;
  overflow-x: auto;
}

:deep(.ProseMirror code) {
  padding: 2px 6px;
  border-radius: 6px;
  background: #eef3f8;
}

:deep(.ProseMirror img) {
  display: block;
  max-width: 100%;
  margin: 16px 0;
  border-radius: 12px;
}

:deep(.ProseMirror hr) {
  margin: 24px 0;
  border: none;
  border-top: 1px solid #d9dee8;
}
</style>
