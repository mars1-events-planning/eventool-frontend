<script lang="ts">
	import Star from '$lib/components/icons/Star.svelte';
	import Event from '$lib/components/icons/Event.svelte';
	import Person from '$lib/components/icons/Person.svelte';
	import SmallLogo from '$lib/components/icons/SmallLogo.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<div class="drawer md:drawer-open">
	<input id="navbar-drawer" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content flex flex-col pt-5 px-2 h-full">
		<div class="flex flex-col w-full items-center fixed bottom-5 z-0 drawer-button pointer-events-none">
			<label for="navbar-drawer" class="btn btn-circle btn-lg btn-primary pointer-events-auto">
				<SmallLogo size={30} />
			</label>
		</div>
		<slot />
	</div>
	<div class="drawer-side ">
		<label for="navbar-drawer" aria-label="close sidebar" class="drawer-overlay "></label>

		<div class="drawer-menu flex flex-col shadow-lg shadow-base-content/25 min-h-[95%] my-5 mx-5 rounded-2xl border pt-5 z-10 pointer-events-auto ">
			<label for="navbar-drawer" aria-label="close sidebar" class="drawer-close btn btn-ghost btn-circle absolute top-1 btn-sm right-1 text-xl font-bold">x</label>
			<ul class="menu p-4 w-80 max-sm:w-60 text-base-content text-lg overflow-y-hidden overflow-x-hidden ">
				<li>
					<a href="/list">
						<div class="pb-1">
							<Event size={20} />
						</div>
						<span>События </span>
					</a>
				</li>
				<li>
					<a href="/profile">
						<div class="pb-1">
							<Person size={20} />
						</div>
						<span>Профиль </span>
					</a>
				</li>
				<li>
					<a href="/" class="flex flex-row items-center">
						<div class="pb-1">
							<Star size={20} />
						</div>
						<span>Главная </span>
					</a>
				</li>
			</ul>
			<Footer />
		</div>
	</div>
</div>

<style lang="postcss">
	/* Adjust the drawer side to move it more to the left */
	@media (min-width: 768px) {
		.drawer-close {
			display: none;
		}

		.drawer-button {
			display: none;
		}
	}

	@media (max-width: 767px) {
		.drawer-toggle:not(:checked) ~ .drawer-side {
			transform: translateX(-20%);
		}

		.drawer-toggle:checked ~ .drawer-side > .drawer-menu {
			@apply bg-base-100;
		}

		.drawer-toggle:checked ~ .drawer-side > .drawer-overlay {
			@apply bg-transparent;
		}

		.drawer-toggle:checked ~ .drawer-content .drawer-button {
			display: none;
		}
	}

	.drawer:has(.drawer-toggle:checked) {
		pointer-events: none;
	}
</style>
