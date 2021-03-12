interface IMailConfig {
  driver: 'ethereal' | 'ses';

  config: {
    aws: {
      region: string;
    };
  };

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  config: {
    ethereal: {},
    aws: {
      region: 'aws-ses-region',
    },
  },

  defaults: {
    from: {
      email: 'enter_your@email.com',
      name: 'Your Name',
    },
  },
} as IMailConfig;
