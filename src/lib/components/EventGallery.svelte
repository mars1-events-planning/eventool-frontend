<script lang="ts">
	import Collapse from "./Collapse.svelte";

	let images = [
		{
			url: "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg",
			text: "",
		},
		{
			url: "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg",
			text: "",
		},
		{
			url: "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg",
			text: "",
		},
		{
			url: "https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg",
			text: "",
		},
	];
</script>

<Collapse checked>
	<span slot="title" class="font-semibold">Галерея</span>
	<div slot="content" class="flex flex-col">
		<div class="divider divider-end">
			<div class="flex flex-col items-end">
				<button
					type="button"
					class="btn btn-primary btn-outline text-xs font-bold btn-xs"
				>
					<span class="text-base">+</span>
				</button>
			</div>
		</div>
		<div class="carousel carousel-center rounded-box">
			{#each images as img}
				<div class="carousel-item">
					<img
						src={img.url}
						alt="EventImage"
					/>
				</div>
			{/each}
		</div>
	</div>
</Collapse>
