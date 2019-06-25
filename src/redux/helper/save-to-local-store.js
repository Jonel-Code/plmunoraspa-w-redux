export function save_to_local_store (store = {}, key = ''){
	localStorage.setItem(key, JSON.stringify(store));
}

export function get_from_local_store (key = ''){
	return JSON.parse(localStorage.getItem(key));
}

export function local_store_clear (){
	localStorage.clear();
}
