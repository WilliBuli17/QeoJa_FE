<template>
  <v-row
    class="fill-height"
    align-content="center"
    justify="center"
  >
    <v-col
      class="text-h4 text-center"
      cols="12"
    >
      Mengambil Data
    </v-col>

    <v-col
      class="mt-n5"
      cols="6"
    >
      <v-progress-linear
        color="primary"
        indeterminate
        rounded
        height="6"
      />
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: 'AppProgressLoading',
  }
</script>
