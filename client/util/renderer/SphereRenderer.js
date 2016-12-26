import NeuronRenderer from './NeuronRenderer'
import HatuEdge from './HatuEdge'

export default class SphereRenderer extends NeuronRenderer {

  generateCone (node, nodeParent) {
    return new HatuEdge(node, nodeParent)
  }

}
