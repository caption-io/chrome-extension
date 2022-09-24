

export function clickAnimation(e: Event, color: string) {
    const target = e.target as HTMLElement;
	target.style.animation = `click 0.35s ease-out`;
	// timeout remove
	setTimeout(() => {
		target.style.animation = '';
	}, 200);
}