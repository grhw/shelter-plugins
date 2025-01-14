const {
	util: { log },
	plugin: { store }
} = shelter;

const callback = (ev) => {
	if (ev.key == "t"&&ev.ctrlKey == true) {
		console.log("Opening Quick Switcher!")
		shelter.flux.dispatcher.dispatch({type: "QUICKSWITCHER_SHOW", query: ""})
	}
}
export function onLoad() { 
	document.addEventListener("keypress",callback)
}

export function onUnload() {
	document.removeEventListener("keypress",callback)
}
