import Vue from 'vue'
import MosaicMain from '@/components/MosaicMain'



describe('Mosaic main screen', () => {


  it('renders', () => {
    const Constructor = Vue.extend(MosaicMain)
    const vm = new Constructor().$mount()

    expect(vm.$el.querySelector('label').textContent)
      .to.equal('Upload your photo ...')
  })



})
