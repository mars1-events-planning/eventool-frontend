<script>
	let {checked = false, canBeClosed = true} = $props()
</script>

<div
	class="
    w-full flex flex-col border rounded-lg
    shadow-lg shadow-base-content/25
	{canBeClosed ? 'hover:shadow-primary/50 hover:border-primary hover:ease-in hover:duration-100' : ''}
	!cursor-default"
>
	<div class="collapse {canBeClosed ? 'collapse-arrow' : 'cursor-default'}">
		<input type="checkbox" checked={checked || !canBeClosed} disabled={!canBeClosed}/>
		<div class="collapse-title">
			<slot name="title"></slot>
		</div>
		<div class="collapse-content !cursor-default overflow-x-auto">
			<slot name="content"></slot>
		</div>
	</div>
</div>
