<script lang="ts">
	import Collapse from "./Collapse.svelte";
	import Trash from "./icons/Trash.svelte";

	let guests = [
		{
			name: "Иванов Петр",
			email: "petr.ivanov.ivanovich20010@gmail.com",
			note: "Друг жениха",
			tags: [
				"Веган",
				"Сторона жениха",
				"Еще что-то",
				"Веган",
				"Сторона жениха",
			],
		},
		{
			name: "Иван Петров",
			email: "ivanpetrov@yandex.ru",
			note: "Еще кто-то",
			tags: ["Сторона жениха"],
		},
	];
</script>

<Collapse>
	<span slot="title" class="font-semibold">Гости</span>
	<div slot="content">some</div>
</Collapse>