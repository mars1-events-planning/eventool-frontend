<script lang="ts">
    import Modal from "./Modal.svelte";
    import Confirm from "$lib/components/icons/Confirm.svelte";

    let { onSubmit, id = null } = $props<{
        onSubmit: (file: File) => void;
        id: string | null;
    }>();

    let imageUrl: string | null = $state(null);
    let selectedFile: File | null = $state(null);

    function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) {
            return;
        }
        const file: File = input.files[0];
        selectedFile = file;

        if (file) {
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    imageUrl = e.target.result as string;
                }
            };
            reader.readAsDataURL(file);
        }
    }

    let modal: Modal;
</script>

<Modal title="Выберите изображение" bind:this={modal}>
    <div slot="button">
        <slot />
    </div>

    <div slot="content" class="flex flex-col gap-4 max-w-64 min-w-64">
        <div class="divider m-0 divider-end">
            <div class="flex flex-row-reverse gap-4">
                <button
                    type="button"
                    class="btn btn-xs btn-primary"
                    onclick={() => {
                        if (selectedFile) {
                            console.log("on submit");
                            onSubmit(selectedFile);
                            modal.close();
                        }
                        console.log("on submit but NO image");
                    }}
                >
                    <Confirm size={20} />
                </button>
            </div>
        </div>
        <input
            onchange={handleFileChange}
            id={`image-input${id ? '-'+id : ''}`}
            type="file"
            accept="image/png, image/gif, image/jpeg"
            class="hidden"
        />
        <label class="btn btn-primary btn-outline w-full" for={`image-input${id ? '-'+id : ''}`}>
            Выбрать изображение
        </label>
        <div>
            {#if imageUrl}
                <div class="avatar">
                    <div class="rounded">
                        <img src="{imageUrl}" alt="Preview" />
                    </div>
                </div>
            {:else}
                <span>Тут будет изображение</span>
            {/if}
        </div>
    </div>
</Modal>
