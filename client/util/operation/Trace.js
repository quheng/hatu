import NodeOperation from "./NodeOperation"
import { TRACE_BOX_OPEN, TRACE_BOX_CLOSE } from "./OperationProxy"
import fetch from 'isomorphic-fetch'

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
  }

  /**
   *
   * @param {Vector3} position
   */
  clickNothing (position) {
    this.x = position.x
    this.y = position.y
    this.z = position.z
    this.getProxy().dispatchEvent({ type: TRACE_BOX_OPEN, trace: this })
  }


  yes () {
    this.getProxy().dispatchEvent({ type: TRACE_BOX_CLOSE, trace: this })
    this.getProxy().conduct(this)
  }

  no () {
    this.getProxy().dispatchEvent({ type: TRACE_BOX_CLOSE, trace: this })
  }

  conduct () {
    let url = `/api/trace/proxy/hatu?x=${Math.round(this.x)}&y=${Math.round(this.y)}&z=${Math.round(this.z)}`
    console.log(url)
    fetch(url, {
      method: 'GET',
      credentials: 'include'
    }).then(response => response.text()).then(text => console.log(text))
  }

  cancel () {

  }

}