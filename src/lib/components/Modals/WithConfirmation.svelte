<script lang="ts">
    import Modal from "./Modal.svelte";

    let { ...props } = $props<{
        title: string;
        text: string;
        onConfirmed: () => void;
        onCancelled: () => void;
    }>();

    let modal: Modal;
</script>

<Modal title={props.title} bind:this={modal}>
    <div slot="button">
        <slot />
    </div>
    <div slot="content" class="flex flex-col items-start gap-5 max-w-[200px] whitespace-break-spaces">
        <p>{props.text}</p>
        <div class="flex flex-row gap-4 justify-center">
            <button
                class="btn btn-outline btn-primary btn-sm"
                onclick={() => {
                    props.onConfirmed();
                    modal.close()
                }}
            >
                Подтвердить
            </button>
            <button
                class="btn btn-outline btn-error btn-sm"
                onclick={() => {
                    props.onCancelled();
                    modal.close();
                }}
            >
                Отмена
            </button>
        </div>
    </div>
</Modal>
