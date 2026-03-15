let _visible = $state(false);
let _message = $state('');
let _timeout: ReturnType<typeof setTimeout> | undefined;

export const toast = {
	get visible() {
		return _visible;
	},
	get message() {
		return _message;
	},
	show(msg: string) {
		if (_timeout) clearTimeout(_timeout);
		_message = msg;
		_visible = true;
		_timeout = setTimeout(() => {
			_visible = false;
		}, 2000);
	}
};
