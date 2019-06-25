import swal from 'sweetalert';
import plmun_logo from '../../assets/plmun-logo.png';

export function open_swal (){
	swal({
		icon: plmun_logo,
		title: 'Sending Data',
		text: 'sending data to server',
		buttons: false,
		closeOnClickOutside: false,
	});
}

export function close_swal (){
	swal.close();
}

export function custom_message_swal (title = '', msg = '', icon = 'error'){
	return swal({
		icon: icon,
		title: title,
		text: msg,
		buttons: { Return: 'return' },
	});
}
