import NodeOperation from './NodeOperation'
import { TRACE_BOX_OPEN, TRACE_BOX_CLOSE, TRACE_BOX_UPDATE } from './OperationProxy'
import fetch from 'isomorphic-fetch'
import Swc from '../swc/Swc'

export default class Trace extends NodeOperation {

  /**
   *
   * @param {OperationProxy} proxy
   * @param {Swc} swc
   */
  constructor (proxy, swc) {
    super(proxy, swc)
    this.x = 0
    this.y = 0
    this.z = 0
    this.state = 0
  }

  /**
   *
   * @param {Vector3} position
   */
  clickNothing (position) {
    this.x = position.x
    this.y = position.y
    this.z = position.z
    if (this.state === 0) {
      this.getProxy().dispatchEvent({ type: TRACE_BOX_OPEN, trace: this })
      this.state = 1
    } else {
      this.getProxy().dispatchEvent({ type: TRACE_BOX_UPDATE, trace: this })
    }
  }

  yes () {
    this.getProxy().dispatchEvent({ type: TRACE_BOX_CLOSE, trace: this })
    this.getProxy().conduct(this)
    this.state = 0
  }

  no () {
    this.getProxy().dispatchEvent({ type: TRACE_BOX_CLOSE, trace: this })
    this.state = 0
  }

  conduct () {
    let url = `/api/trace/proxy/hatu?x=${Math.round(this.x)}&y=${Math.round(this.y)}&z=${Math.round(this.z)}`
    console.log(url)
    fetch(url, {
      method: 'GET',
      credentials: 'include'
    }).then(response => response.text()).then(text => {
      console.log(text)
      this.swc = new Swc(text, 0x444400)
      this.swc.setPosition(-this.getProxy().viewer.center[0], -this.getProxy().viewer.center[1], -this.getProxy().viewer.center[2])
      this.getProxy().viewer.supervisor.addSwc(this.swc)
      this.getProxy().viewer.scene.add(this.swc)
    })
  }

  cancel () {
    this.getProxy().viewer.scene.remove(this.swc)
    this.getProxy().viewer.supervisor.removeSwc(this.swc)
  }

}
