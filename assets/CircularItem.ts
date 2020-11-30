/* * @Author: steveJobs * @Email: icipiqkm@gmail.com * @Date: 2020-11-30 15:26:29 * @Last Modified by:   steveJobs * @Last Modified time: 2020-11-30 15:26:29 * @Description: Description */
import CircularMenu from './CircularMenu';
const { ccclass, property } = cc._decorator;
@ccclass
export default class CircularItem extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;
    isFollow: boolean
    index: number
    info: any
    parent: CircularMenu
    centerIndex: number
    target: cc.Vec2
    direction: number
    speed: number = 5
    angle: number
    show(index, info, parent) {
        this.index = index
        this.parent = parent
        this.target = cc.v2(this.parent.radius, 0)
        // this.node.setPosition(cc.v2(this.parent.radius, 0).rotateSelf(index * this.parent.interval))
        this.node.setPosition(cc.v2(this.parent.radius, 0))
        this.refreshItem(info)
    }
    refreshItem(info) {
        this.info = info
        this.label.string = this.info.name
    }
    onClick() {
        this.angle = 0
        this.direction = this.getDirection()
        this.parent.onClick(this)
    }
    follow(item) {
        this.centerIndex = item.index
        if (item.index !== this.index) {
            this.angle = (this.index - item.index) * this.parent.interval
            if (item.direction === 0) {
                this.direction = this.getDirection()
            } else {
                this.direction = item.direction
            }
        }
        this.speed = 10
        this.isFollow = true
    }

    following(dt) {
        var scale = this.node.position.angle(cc.v3(this.parent.radius, 0)) / 3
        this.node.setScale(1 - scale)
        var newOffset = this.angle * scale * 0.5
        var angle = this.node.position.angle(this.target.rotate(this.angle - newOffset) as any)
        var pos = cc.v2(this.node.position.x, this.node.position.y).rotate(this.direction * angle * this.speed * 0.01)
        this.node.setPosition(pos)

        if (this.parent.maxItemCount > 1) {
            var bound = 1.5
            if (this.parent.maxItemCount === 2) {
                bound = 0.5
            }
            if (this.parent.maxItemCount === 3) {
                bound = 0.9
            }
            if (this.parent.maxItemCount === 4) {
                bound = 0.9
            }
            if (this.parent.maxItemCount === 5) {
                bound = 1.3
            }
            if (this.index === 0) {
                var left = this.node.position.angle(cc.v3(this.parent.radius, 0))
                if (left > bound && this.direction === -1) {
                    this.parent.remIndexs(this)
                    this.angle = (this.parent.maxItemCount - this.centerIndex) * this.parent.interval
                    this.speed += 3
                }
            }
            if (this.index === this.parent.maxItemCount - 1) {
                var left = this.node.position.angle(cc.v3(this.parent.radius, 0))
                if (left > bound && this.direction === 1) {
                    this.parent.addIndexs(this)
                    this.angle = -(this.centerIndex + 1) * this.parent.interval
                    this.speed += 3
                }
            }
        }

        if (angle <= 0.01) {
            this.isFollow = false
            this.parent.onCenter(this.info)
        }
    }
    resetPosScale(newOffset) {
        var angle = this.node.position.angle(this.target.rotate(this.angle - newOffset) as any)
        var pos = cc.v2(this.node.position.x, this.node.position.y).rotate(this.direction * angle)
        this.node.setPosition(pos)
        var scale = this.node.position.angle(cc.v3(this.parent.radius, 0)) / 3
        this.node.setScale(1 - scale)
    }
    addIndex(item) {
        if (this === item) {
            this.index = 0
            return
        }
        this.index++
        this.centerIndex++

    }
    remIndex(item) {
        if (this === item) {
            this.index = this.parent.maxItemCount - 1
            return
        }
        this.index--
        this.centerIndex--
    }
    update(dt) {
        if (this.isFollow) {
            this.following(dt)
        }
    }
    getDirection(): number {
        var normalizLocal = cc.v2(this.node.position.x, this.node.position.y).normalizeSelf()
        var newOffset = this.angle * this.node.scale * 0.5
        var normalizParent = this.target.rotate(this.angle - newOffset).normalizeSelf()
        var dir = normalizLocal.cross(normalizParent)
        if (dir > 0) {
            return 1
        } else if (dir < 0) {
            return -1
        }
        return 0
    }
}
