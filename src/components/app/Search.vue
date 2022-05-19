<template>
  <v-text-field
    class="pa-4"
    placeholder="Search"
    color="primary"
    hide-details
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template
      v-slot:append-outer
    >
      <v-btn
        class="mt-n1"
        fab
        small
        elevation="2"
        height="35"
        width="35"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script>
  export default {
    name: 'AppSearch',
  }
</script>
