const {
	solid: { onCleanup },
	util: { log },
	plugin: { store },
	flux: { stores }
} = shelter;
import css from "./style.css"

function createButton() {
	const parent = document.querySelector('.buttons_b2ca13:has([aria-label="Mute"]):not(:has(.guhw-fmd))')
	if (parent) {
		var button = parent.childNodes[1].cloneNode(true)
		parent.appendChild(button)
		button.classList.add("guhw-fmd")
		button.setAttribute("aria-label","Lock Voice State")
		button.querySelector("svg").innerHTML = `<path fill="currentColor" fill-rule="evenodd" d="M6 9h1V6a5 5 0 0 1 10 0v3h1a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3Zm9-3v3H9V6a3 3 0 1 1 6 0Zm-1 8a2 2 0 0 1-1 1.73V18a1 1 0 1 1-2 0v-2.27A2 2 0 1 1 14 14Z" clip-rule="evenodd" class=""></path>`
		button.addEventListener("click",()=>{
			button.classList.toggle("guhw-fmd-activated")
			if (button.classList.contains("guhw-fmd-activated")) {
				shelter.ui.showToast({
					title: "Fake Mute-Deafen",
					content: "Locked current voice state. Clicking Mute/Deaf will unmute/undeafen you, but it wont update the icons anywhere."
				})
				
				store.deafened = stores.MediaEngineStore.isSelfDeaf()
				store.muted = stores.MediaEngineStore.isSelfMute()
				store.active = true
			} else {
				shelter.ui.showToast({
					title: "Fake Mute-Deafen",
					content: "Unlocked current voice state."
				})
				store.active = false
			}
		})
	}
	return button
}

var unpatch_deaf
var unpatch_mute
var remove_css
export function onLoad() {
	log("[fakeMuteDeafen] loaded :3")

	unpatch_deaf = shelter.patcher.after("isSelfDeaf",stores.MediaEngineStore,(args,ret)=>{
		if (store.active) {
			return store.deafened
		}
	})
	unpatch_mute = shelter.patcher.after("isSelfMute",stores.MediaEngineStore,(args,ret)=>{
		if (store.active) {
			return store.mute
		}
	})

	createButton()
	onCleanup(()=>{
		createButton()
	})
	remove_css = shelter.ui.injectCss(css)
}

export function onUnload() {
	remove_css()
	document.querySelectorAll(".guhw-fmd").forEach(element => {
		element.remove()
		console.log(element)
	});
	unpatch_deaf()
	unpatch_mute()
}
