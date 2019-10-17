<template>
  <div class="clipper-field">
    <file-field
      v-if="!isEditorOpened"
      name="clipper-field-img"
      :value="oldFile"
      :note="note"
      :document-type="documentType"
      :label="label"
      :min-width="minWidth"
      :min-height="minHeight"
      :disabled="disabled"
      :file-extensions="fileExtensions"
      :max-size="maxSize"
      :error-message="errorMessage"
      @input="upload"
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
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

const MAX_FILE_MEGABYTES = 32
const IMAGE_FILE_EXTENSIONS = ['jpg', 'png', 'jpeg']

export default {
  name: 'clipper-field',
  components: {
    FileField,
  },
  mixins: [],
  props: {
    value: { type: DocumentContainer, default: null },
    label: { type: String, default: '' },
    documentType: { type: String, default: 'default' },
    fileExtensions: { type: Array, default: _ => IMAGE_FILE_EXTENSIONS },
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
      oldFile: null,
      imgURL: '',
      resultURL: '',
      newImg: null,
      isEditorOpened: false,
    }
  },
  computed: {},
  watch: {
  },
  created () {
    this.oldFile = this.value
  },
  destroyed () {
  },
  methods: {
    upload (value) {
      if (this.imgURL) URL.revokeObjectURL(this.imgURL)
      if (value) {
        this.oldFile = value
        this.imgURL = window.URL.createObjectURL(value.file)
        this.isEditorOpened = true
      } else {
        this.imgURL = ''
        this.isEditorOpened = false
      }
    },
    cropImg () {
      const canvas = this.$refs.clipper.clip() // call component's clip method
      this.resultURL = canvas.toDataURL('image/jpeg', 1) // canvas->image
      this.oldFile = new DocumentContainer({
        mimeType: 'image/png',
        name: 'new__' + this.oldFile.name,
        type: this.documentType,
        file: this.dataURItoBlob(this.resultURL),
      })
      this.isEditorOpened = false
      this.$emit('input', this.oldFile)
    },
    reset () {
      if (this.imgURL) URL.revokeObjectURL(this.imgURL)
      this.imgURL = ''
      this.oldFile = null
      this.isEditorOpened = false
    },
    dataURItoBlob (dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer
      // #6850276 for code that does this
      let byteString = atob(dataURI.split(',')[1])

      // separate out the mime component
      let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

      // write the bytes of the string to an ArrayBuffer
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
