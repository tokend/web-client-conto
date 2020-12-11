<template>
  <div class="clipper-field">
    <file-field
      v-if="!isEditorOpened"
      name="clipper-field-img"
      :value="originImg"
      :note="note"
      :document-type="documentType"
      :label="label"
      :min-width="minWidth"
      :min-height="minHeight"
      :disabled="disabled"
      :file-extensions="IMAGE_FILE_EXTENSIONS"
      :max-size="maxSize"
      :error-message="errorMessage"
      @input="tryCropImg"
    />
    <template v-if="isEditorOpened">
      <div
        class="clipper-field__label"
        :class="{
          'clipper-field__label--disabled': $attrs.disabled,
          'clipper-field__label--error': errorMessage
        }"
      >
        {{ label }}
      </div>
      <div class="clipper-field__editor">
        <clipper-basic
          class="clipper-field__clipper"
          :src="imgURL"
          ref="clipper"
          bg-color="transparent"
          :ratio="ratio"
        >
          <div class="clipper-field__no-image" slot="placeholder">
            <!-- eslint-disable max-len -->
            <i class="mdi mdi-face-recognition clipper-field__icon clipper-field__reset-icon" />
            <!-- eslint-enable max-len -->
          </div>
        </clipper-basic>
        <div class="clipper-field__actions">
          <button
            v-if="!$attrs.disabled"
            :title="'clipper-field.save-lbl' | globalize"
            class="app__button-flat"
            type="button"
            :disabled="disabled"
            @click="cropImg"
          >
            {{ 'clipper-field.save-lbl' | globalize }}
          </button>
          <button
            v-if="!$attrs.disabled"
            :title="'clipper-field.cancel-lbl' | globalize"
            class="app__button-flat clipper-field__reset-btn"
            type="button"
            :disabled="disabled"
            @click="reset"
          >
            {{ 'clipper-field.cancel-lbl' | globalize }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import FileField from '@/vue/fields/FileField'
import { Document } from '@tokend/js-sdk'
import { DOCUMENT_POLICIES } from '@/js/const/document-policies.const'

const MAX_FILE_MEGABYTES = 32
const IMAGE_FILE_EXTENSIONS = ['jpg', 'png', 'jpeg']

export default {
  name: 'clipper-field',
  components: {
    FileField,
  },
  props: {
    value: { type: Document, default: () => new Document() },
    label: { type: String, default: '' },
    documentType: { type: String, default: 'default' },
    maxSize: { type: Number, default: MAX_FILE_MEGABYTES },
    note: { type: String, default: 'All files' },
    errorMessage: { type: String, default: undefined },
    minWidth: { type: Number, default: 0 },
    minHeight: { type: Number, default: 0 },
    // eslint-disable-next-line max-len
    ratio: { type: Number, default: 1 }, // ratio of clipping area (width/height). ex: 1, 4/3 .
    disabled: { type: Boolean, default: false },
  },
  data () {
    return {
      IMAGE_FILE_EXTENSIONS,
      originImg: null,
      imgURL: '',
      resultURL: '',
      isEditorOpened: false,
    }
  },
  created () {
    this.originImg = this.value
  },
  methods: {
    tryCropImg (value) {
      if (value.isEmpty) {
        this.reset()
      } else {
        this.originImg = value
        if (this.imgURL) URL.revokeObjectURL(this.imgURL)
        this.imgURL = window.URL.createObjectURL(value.file)
        this.isEditorOpened = true
      }
    },
    async cropImg () {
      const canvas = this.$refs.clipper.clip() // call component's clip method
      this.resultURL = canvas.toDataURL(this.originImg.mimeType, 1)
      const blob = this.dataURItoBlob(this.resultURL)
      this.originImg = new Document({
        mimeType: blob.type,
        name: 'new__' + this.originImg.name,
        file: blob,
      }, DOCUMENT_POLICIES[this.documentType])
      this.isEditorOpened = false
      this.$emit('input', this.originImg)
    },
    reset () {
      if (this.imgURL) URL.revokeObjectURL(this.imgURL)
      this.imgURL = ''
      this.originImg = new Document()
      this.isEditorOpened = false
      this.$emit('input', this.originImg)
    },
    dataURItoBlob (dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer
      // #6850276 for code that does this
      let byteString = atob(dataURI.split(',')[1])

      let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

      let ab = new ArrayBuffer(byteString.length)
      let ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ab], { type: mimeString })
    },
  },
}
</script>

<style lang="scss" scoped>
  @import 'scss/variables';
  @import '~@scss/mixins';

  $max-width: 40rem;

  .clipper-field {
    width: 100%;
  }

  .clipper-field__editor {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 0.2rem dashed $file-field-border-color;
    background-color: $file-field-background-color;
    border-radius: 0.4rem;
    transition: 0.2s;
    width: 100%;
    text-align: center;
    position: relative;
    padding: 3%;
  }

  .clipper-field__label {
    font-size: 1.1rem;
    color: $field-color-unfocused;
    margin-bottom: 0.6rem;

    @include label-font-sizes;
  }

  .clipper-field__label--error {
    color: $field-color-error;
  }

  .clipper-field__label--disabled {
    filter: grayscale(100%);
  }

  .clipper-field__clipper {
    max-width: $max-width;
  }

  .clipper-field__reset-btn {
    color: $col-button-back-icon;
  }

  .clipper-field__icon {
    font-size: 2.4rem;
    display: flex;

    &:before {
      font-weight: 600;
      vertical-align: middle;
    }
  }

  .clipper-field__actions {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    width: 100%;
    max-width: $max-width;
  }

  .clipper-field__no-image {
    display: flex;
    justify-content: center;
    padding: 2rem;
  }
</style>
