import NeuronRenderer from './NeuronRenderer'
import HatuSkeleton from './HatuSkeleton'

export default class SkeletonRenderer extends NeuronRenderer {

  generateCone (node, nodeParent) {
    return new HatuSkeleton(node, nodeParent)
  }
}
