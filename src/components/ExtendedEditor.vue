<script setup>
// import { h } from 'snabbdom'
import { onBeforeUnmount, ref, shallowRef } from 'vue'
// import { IButtonMenu } from '@wangeditor/core'
import { Boot } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

// 测试：注册 button menu
class MyButtonMenu {
  constructor() {
    this.title = 'menu1',
        this.tag = 'button'
  }
  getValue() { return '' }
  isActive() { return false }
  isDisabled() { return false }
  exec(editor) {
    console.log(editor)
    alert('menu1 exec')
  }
}
const menuConf = {
  key: 'my-menu-1', // menu key ，唯一。注册之后，需通过 toolbarKeys 配置到工具栏
  factory() {
    return new MyButtonMenu()
  },
}
Boot.registerMenu(menuConf)
console.log(1111111111)


// 编辑器实例，必须用 shallowRef ，重要！
const editorRef = shallowRef()

// 内容 HTML

const html = localStorage.getItem('wangHtml') || '<p>hello&nbsp;world</p>'
const valueHtml = ref(html)

// 编辑器配置
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    insertImage: {
      checkImage(src) {
        console.log('image src', src)
        if (src.indexOf("http") !== 0) {
          return "图片网址必须以 http/https 开头";
        }
        return true;
      },
    },


  },
}

editorConfig.MENU_CONF['uploadImage'] = {
  server: 'http://localhost:3000/fileUpload',
  // server: '/api/upload-img-10s', // test timeout
  // server: '/api/upload-img-failed', // test failed
  // server: '/api/xxx', // test 404

  timeout: 5 * 1000, // 5s

  fieldName: 'custom-fileName',
  meta: { token: 'xxx', a: 100 },
  metaWithUrl: true, // join params to url
  headers: { Accept: 'text/x-json' },

  maxFileSize: 10 * 1024 * 1024, // 10M

  base64LimitSize: 5 * 1024, // insert base64 format, if file's size less than 5kb

  onBeforeUpload(file) {
    console.log('onBeforeUpload', file)

    return file // will upload this file
    // return false // prevent upload
  },
  onProgress(progress) {
    console.log('onProgress', progress)
  },
  onSuccess(file, res) {
    console.log('onSuccess', file, res)
  },
  onFailed(file, res) {
    alert(res.message)
    console.log('onFailed', file, res)
  },
  onError(file, err, res) {
    alert(err.message)
    console.error('onError', file, err, res)
  },

  // customInsert(res, insertFn) {
  //   console.log('customInsert', res)
  //   const imgInfo = res.data[0] || {}
  //   const { url, alt, href } = imgInfo
  //   if (!url) throw new Error(`Image url is empty`)

  //   console.log('Your image url ', url)
  //   insertFn(url, alt, href)
  // },

  // customUpload(file, insertFn) {
  //   console.log('customUpload', file)

  //   return new Promise((resolve) => {
  //     // Simulate async insert image
  //     setTimeout(() => {
  //       const src = `https://www.baidu.com/img/flexible/logo/pc/result@2.png?r=${Math.random()}`
  //       insertFn(src, 'baidu logo', src)
  //       resolve('ok')
  //     }, 500)
  //   })
  // },

  // customBrowseAndUpload(insertFn) {
  //   alert('Custom browse and upload')

  //   // Simulate async insert image
  //   setTimeout(() => {
  //     const src = 'https://www.baidu.com/img/flexible/logo/pc/result@2.png'
  //     insertFn(src, 'baidu logo', src) // insert a image
  //   }, 500)
  // },
}

// 工具栏配置
const toolbarConfig = {
  // toolbarKeys: ['headerSelect', 'bold', 'my-menu-1'],
  // excludeKeys: [],
  insertKeys: {
    index: 0,
    keys: 'my-menu-1'
  }
}

// 编辑器回调函数
const handleCreated = (editor) => {
  console.log("created", editor);

  editorRef.value = editor // 记录 editor 实例，重要！

  // window.editor = editor // 临时测试使用，用完删除
}
const handleChange = (editor) => {
  console.log("change:", editor.children);
}
const handleDestroyed = (editor) => {
  console.log('destroyed', editor)
}
const handleFocus = (editor) => {
  console.log('focus', editor)
}
const handleBlur = (editor) => {
  console.log('blur', editor)
}
const customAlert = (info, type) => {
  alert(`【自定义提示】${type} - ${info}`)
}
const customPaste = (editor, event, callback) => {
  console.log('ClipboardEvent 粘贴事件对象', event)

  // 自定义插入内容
  editor.insertText('xxx')

  // 返回值（注意，vue 事件的返回值，不能用 return）
  callback(false) // 返回 false ，阻止默认粘贴行为
  // callback(true) // 返回 true ，继续默认的粘贴行为
}

// 及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return

  // 销毁，并移除 editor
  editor.destroy()
})

const getHtml = () => {
  const editor = editorRef.value
  if (editor == null) return
  localStorage.setItem('wangHtml',editor.getHtml())

  // console.log(editor.getHtml())
}




</script>

<template>
  <div style="text-align: right;">
    <button  @click="getHtml">保存</button>
  </div>
  <div style="border: 1px solid #ccc">
    <!-- 工具栏 -->
    <Toolbar
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        style="border-bottom: 1px solid #ccc"
    />
    <!-- 编辑器 -->
    <Editor
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        @onChange="handleChange"
        @onCreated="handleCreated"
        @onDestroyed="handleDestroyed"
        @onFocus="handleFocus"
        @onBlur="handleBlur"
        @customAlert="customAlert"
        @customPaste="customPaste"
        style="height: 500px"
    />
  </div>
</template>

<style src="@wangeditor/editor/dist/css/style.css"></style>