<template>
  <v-autocomplete
    :color="color"
    :label="label"
    persistent-hint
    :return-object="false"
    :placeholder="label"
    dense
    required
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
  export default {
    name: 'AppTextAutocomplete',

    props: {
      color: {
        type: String,
        default: 'primary',
      },
      label: String,
    },
  }
</script>
