<script lang="ts">
	const { ...props } = $props<{
		title: string;
		onClose?: () => void;
	}>();

	let opened = $state(false);

	export function close() {
		opened = false;
		if (props.onClose) props.onClose();
	};
</script>

<button onclick={() => (opened = true)}>
	<slot name="button" />
</button>

<dialog
	id={crypto.randomUUID()}
	class="modal backdrop-blur-sm backdrop-brightness-75"
	open={opened}
>
	<div class="modal-box w-auto max-w-[100vw] mx-auto overflow-y-auto p-4">
		<div class="flex flex-col gap-2">
			<div class="flex flex-row justify-between items-center font-medium">
				<p class=" text-base">{props.title}</p>
				<form method="dialog">
					<button
						type="button"
						class="btn btn-sm btn-circle btn-ghost font-bold"
						onclick={() => close()}
						>✕
					</button>
				</form>
			</div>
			<div class="flex !font-normal text-base">
				<slot name="content" />
			</div>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={() => close()} type="button">close</button>
	</form>
</dialog>
