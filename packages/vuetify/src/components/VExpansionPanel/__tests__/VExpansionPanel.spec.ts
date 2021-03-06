// Components
import VExpansionPanel from '../VExpansionPanel'
import VExpansionPanelHeader from '../VExpansionPanelHeader'
import VExpansionPanelContent from '../VExpansionPanelContent'

// Utilities
import {
  mount,
  Wrapper,
} from '@vue/test-utils'

describe('VExpansionPanel', () => {
  type Instance = InstanceType<typeof VExpansionPanel>
  let mountFunction: (options?: object) => Wrapper<Instance>

  beforeEach(() => {
    mountFunction = (options = {}) => {
      return mount(VExpansionPanel, {
        slots: {
          default: [
            VExpansionPanelHeader,
            VExpansionPanelContent,
          ],
        },
        provide: {
          expansionPanels: {
            register: () => {},
            unregister: () => {},
          },
        },
        ...options,
      })
    }
  })

  it('should respond to clicks', () => {
    const click = jest.fn()
    const toggle = jest.fn()
    const wrapper = mountFunction({
      propsData: { readonly: true },
      methods: { toggle },
    })

    wrapper.vm.$on('click', click)
    const spy = jest.spyOn(wrapper.vm.header.$el, 'blur')
    const header = wrapper.find('.v-expansion-panel-header')

    header.trigger('click')

    expect(spy).not.toHaveBeenCalled()
    expect(click).toHaveBeenCalledTimes(1)
    expect(toggle).not.toHaveBeenCalled()

    wrapper.setProps({ readonly: false })

    header.trigger('click')

    expect(spy).not.toHaveBeenCalled()
    expect(click).toHaveBeenCalledTimes(2)
    expect(toggle).toHaveBeenCalledTimes(1)

    // Mock detail
    const event = { detail: 1 } as MouseEvent
    wrapper.vm.onClick(event)

    expect(spy).toHaveBeenCalled()
    expect(click).toHaveBeenCalledTimes(3)
    expect(toggle).toHaveBeenCalledTimes(2)
  })

  // Ensures smooth transition when using the lazy prop
  // TODO: move to PanelContent tests
  /* it('should boot expansion panel item', async () => {
    const change = jest.fn()
    const wrapper = mountFunction({
      propsData: {
        lazy: true
      }
    })

    wrapper.vm.$on('change', change)

    expect(wrapper.vm.isBooted).toBe(false)

    wrapper.vm.toggle()

    expect(wrapper.vm.isBooted).toBe(true)

    await wrapper.vm.$nextTick()

    expect(change).toHaveBeenCalled()
  }) */

  it('should hide actions and match snapshot', async () => {
    const wrapper = mountFunction({
      slots: {
        default: [
          {
            render: h => h(VExpansionPanelHeader, {
              props: { hideActions: true },
            }),
          },
          VExpansionPanelContent,
        ],
      },
    })

    const wrapper2 = mountFunction()
    const snapshot = wrapper.html()
    const snapshot2 = wrapper2.html()

    expect(snapshot).toMatchSnapshot()
    expect(snapshot2).toMatchSnapshot()
    expect(snapshot).not.toEqual(snapshot2)
  })

  it('should register and unregister header/content', () => {
    const wrapper = mountFunction()
    const header = wrapper.find('.v-expansion-panel-header')
    const content = wrapper.find('.v-expansion-panel-content')

    expect(wrapper.vm.header).toBeTruthy()
    expect(wrapper.vm.content).toBeTruthy()

    header.destroy()
    content.destroy()

    expect(wrapper.vm.header).toBeNull()
    expect(wrapper.vm.content).toBeNull()
  })

  it('should toggle, boot content and emit a change', async () => {
    const change = jest.fn()
    const wrapper = mountFunction()
    const content = wrapper.find('.v-expansion-panel-content') as typeof VExpansionPanelContent

    wrapper.vm.$on('change', change)

    expect(content.vm.isBooted).toBe(false)

    wrapper.vm.toggle()

    expect(content.vm.isBooted).toBe(true)

    await wrapper.vm.$nextTick()

    expect(change).toHaveBeenCalled()
  })
})
