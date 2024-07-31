const { defineConfig } = require("cypress");
const { Pool } = require("pg");

const pool = new Pool({
  host: 'aws-0-us-west-1.pooler.supabase.com',
  user: 'postgres.yrykzwzxowohpltbydzk',
  password: 'Migmol@889020',
  database: 'postgres',
  port: 6543
});

module.exports = defineConfig({
  // setupNodeEvents can be defined in either
  // the e2e or component configuration
  e2e: {
    e2e: {
      baseUrl: 'http://localhost:3000',
      viewportWidth: 1440,
      viewportHeight: 900,
    },
    setupNodeEvents(on, config) {
      // bind to the event we care about
      on('task', {
        removeUser: function(email) {
          return new Promise(function(resolve) {
            pool.query('DELETE FROM public.users WHERE email = $1', [email], function(error, result) {
              if (error) {
                throw error;
              }
              resolve({success: result.rowCount});
            });
          });
        }
      });
    },
  },
});