<div
	class="
    w-full flex flex-col border rounded-lg
    shadow-lg shadow-base-content/25 
	hover:shadow-primary/50 hover:border-primary hover:ease-in hover:duration-100"
>
	<div class="collapse collapse-arrow">
		<input type="checkbox" />
		<div class="collapse-title">
			<slot name="title"></slot>
		</div>
		<div class="collapse-content">
			<slot name="content"></slot>
		</div>
	</div>
</div>
