import { Container, Graphics, Rectangle, Text } from 'pixi.js'
import { GAME_CONFIG } from '../game/GameConfig'
import type { FederatedPointerEvent } from 'pixi.js'

export class RulesOverlay {
	public readonly view: Container

	public constructor(onClose: () => void) {
		this.view = new Container()
		this.view.visible = false

		const backdrop = new Graphics()
			.rect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height)
			.fill({ color: 0x000000, alpha: 0.65 })
		backdrop.eventMode = 'static'
		backdrop.hitArea = new Rectangle(
			0,
			0,
			GAME_CONFIG.width,
			GAME_CONFIG.height
		)
		backdrop.on('pointerdown', (event: FederatedPointerEvent) => {
			event.stopPropagation()
			onClose()
		})

		const panelW = 560
		const panelH = 420
		const panelX = (GAME_CONFIG.width - panelW) / 2
		const panelY = (GAME_CONFIG.height - panelH) / 2

		const panel = new Graphics()
			.roundRect(panelX, panelY, panelW, panelH, 16)
			.fill(0x0f172a)
			.stroke({ color: 0xfacc15, width: 3 })

	
		const title = new Text({
			text: '— HOW TO PLAY —',
			style: {
				fill: 0xfacc15,
				fontFamily: 'Arial',
				fontSize: 26,
				fontWeight: '700',
				letterSpacing: 2
			}
		})
		title.anchor.set(0.5, 0)
		title.position.set(GAME_CONFIG.width / 2, panelY + 24)

	
		const divider = new Graphics()
			.rect(panelX + 30, panelY + 66, panelW - 60, 2)
			.fill({ color: 0xfacc15, alpha: 0.4 })

	
		const rules: Array<{ icon: () => Graphics; text: string }> = [
			{
				icon: () =>
					new Graphics()
						.circle(0, 0, 16)
						.fill(0xef4444)
						.stroke({ color: 0x7f1d1d, width: 3 }),
				text: 'You are the red circle — the Shepherd.\nClick anywhere on the field to move.'
			},
			{
				icon: () =>
					new Graphics()
						.circle(0, 0, 12)
						.fill(0xffffff)
						.stroke({ color: 0xcbd5e1, width: 2 }),
				text: 'White circles are animals.\nWalk close to them — they will follow you.'
			},
			{
				icon: () => this.groupIcon(),
				text: 'You can lead up to 5 animals at a time.\nAnimals form a chain behind you.'
			},
			{
				icon: () =>
					new Graphics()
						.rect(-18, -18, 36, 36)
						.fill(0xfacc15)
						.stroke({ color: 0xa16207, width: 3 }),
				text: 'Walk the group into the yellow Yard.\nEach delivered animal scores +1 point.'
			}
		]

		const rowStartY = panelY + 86
		const rowHeight = 76
		const iconX = panelX + 52
		const textX = panelX + 100

		const rows = new Container()

		rules.forEach((rule, i) => {
			const y = rowStartY + i * rowHeight
			const iconCenterY = y + 28

			const icon = rule.icon()
			icon.position.set(iconX, iconCenterY)
			rows.addChild(icon)

			const label = new Text({
				text: rule.text,
				style: {
					fill: 0xe2e8f0,
					fontFamily: 'Arial',
					fontSize: 16,
					fontWeight: '400',
					lineHeight: 22,
					wordWrap: true,
					wordWrapWidth: panelW - 120
				}
			})
			label.position.set(textX, y + 6)
			rows.addChild(label)

			if (i < rules.length - 1) {
				const line = new Graphics()
					.rect(panelX + 30, y + 64, panelW - 60, 1)
					.fill({ color: 0xffffff, alpha: 0.08 })
				rows.addChild(line)
			}
		})

		const closeBtn = new Container()
		closeBtn.position.set(panelX + panelW - 20, panelY + 20)
		closeBtn.eventMode = 'static'
		closeBtn.cursor = 'pointer'
		closeBtn.hitArea = new Rectangle(-20, -20, 40, 40)
		closeBtn.on('pointerdown', (event: FederatedPointerEvent) => {
			event.stopPropagation()
			onClose()
		})

		const closeBg = new Graphics()
			.circle(0, 0, 14)
			.fill({ color: 0xffffff, alpha: 0.15 })
		const closeLabel = new Text({
			text: '✕',
			style: {
				fill: 0xffffff,
				fontFamily: 'Arial',
				fontSize: 15,
				fontWeight: '700'
			}
		})
		closeLabel.anchor.set(0.5)
		closeLabel.position.set(0, 0)
		closeBtn.addChild(closeBg, closeLabel)

		const hint = new Text({
			text: 'Deliver all animals to complete the round',
			style: {
				fill: 0x64748b,
				fontFamily: 'Arial',
				fontSize: 13,
				fontWeight: '400'
			}
		})
		hint.anchor.set(0.5, 1)
		hint.position.set(GAME_CONFIG.width / 2, panelY + panelH - 14)

		this.view.addChild(backdrop, panel, title, divider, rows, closeBtn, hint)
	}

	public show(): void {
		this.view.visible = true
	}

	public hide(): void {
		this.view.visible = false
	}

	private groupIcon(): Graphics {
		const g = new Graphics()
		const positions = [-14, 0, 14]
		for (const dx of positions) {
			g.circle(dx, 0, 8).fill(0xffffff).stroke({ color: 0xcbd5e1, width: 1.5 })
		}
		return g
	}
}
