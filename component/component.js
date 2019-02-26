/*!!!!!!!!!!!Do not change anything between here (the DRIVERNAME placeholder will be automatically replaced at buildtime)!!!!!!!!!!!*/
// https://github.com/rancher/ui/blob/master/lib/shared/addon/mixins/cluster-driver.js
import ClusterDriver from 'shared/mixins/cluster-driver';
import { satisfies } from 'shared/utils/parse-version';
import { sortableNumericSuffix } from 'shared/utils/util';

// do not remove LAYOUT, it is replaced at build time with a base64 representation of the template of the hbs template
// we do this to avoid converting template to a js file that returns a string and the cors issues that would come along with that
const LAYOUT;
/*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/


/*!!!!!!!!!!!GLOBAL CONST START!!!!!!!!!!!*/
// EMBER API Access - if you need access to any of the Ember API's add them here in the same manner rather then import them via modules, since the dependencies exist in rancher we dont want to expor the modules in the amd def
const computed      = Ember.computed;
const observer      = Ember.observer;
const get           = Ember.get;
const set           = Ember.set;
const setProperties = Ember.setProperties;
const alias         = Ember.computed.alias;
const service       = Ember.inject.service;
const all           = Ember.RSVP.all;
const reject        = Ember.RSVP.reject;

/*!!!!!!!!!!!GLOBAL CONST END!!!!!!!!!!!*/

const times = [
  {
    value: null,
    label: 'Any Time',
  },
  {
    value: '00:00',
    label: '12:00AM',
  },
  {
    value: '03:00',
    label: '3:00AM',
  },
  {
    value: '06:00',
    label: '6:00AM',
  },
  {
    value: '09:00',
    label: '9:00AM',
  },
  {
    value: '12:00',
    label: '12:00PM',
  },
  {
    value: '15:00',
    label: '3:00PM',
  },
  {
    value: '19:00',
    label: '7:00PM',
  },
  {
    value: '21:00',
    label: '9:00PM',
  },
]

const imageType = [
  {
    label: 'clusterNew.googlegke.imageType.UBUNTU',
    value: 'UBUNTU',
  },
  {
    label: 'clusterNew.googlegke.imageType.COS',
    value: 'COS'
  },
]

const diskType = [
  {
    label: 'clusterNew.googlegke.diskType.pd-standard',
    value: 'pd-standard',
  },
  {
    label: 'clusterNew.googlegke.diskType.pd-ssd',
    value: 'pd-ssd',
  }
]

const DEFAULT_AUTH_SCOPES = ['devstorage.read_only', 'logging.write', 'monitoring', 'servicecontrol', 'service.management.readonly', 'trace.append']



/*!!!!!!!!!!!DO NOT CHANGE START!!!!!!!!!!!*/
export default Ember.Component.extend(ClusterDriver, {
  driverName:  '%%DRIVERNAME%%',
  configField: '%%DRIVERNAME%%EngineConfig', // 'googleKubernetesEngineConfig'
  app:         service(),
  router:      service(),
/*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/

  init() {
    /*!!!!!!!!!!!DO NOT CHANGE START!!!!!!!!!!!*/
    // This does on the fly template compiling, if you mess with this :cry:
    const decodedLayout = window.atob(LAYOUT);
    const template      = Ember.HTMLBars.compile(decodedLayout, {
      moduleName: 'shared/components/cluster-driver/driver-%%DRIVERNAME%%/template'
    });
    set(this,'layout', template);

    this._super(...arguments);
    /*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/

    let config      = get(this, 'config');
    let configField = get(this, 'configField');


    if ( !config ) {
      config = get(this, 'globalStore').createRecord({
        type:               configField,
        diskSizeGb:         100,
        enableAlphaFeature: false,
        nodeCount:          3,
        machineType:        'g1-small',
        zone:               'us-central1-f',
        clusterIpv4Cidr:    '',
        minNodeCount:       1,
        maxNodeCount:       1,
        imageType:          'UBUNTU',
        diskType:           'pd-standard',
        taints:             [],
      });

      set(this, `cluster.${ configField }`, config);

      setProperties(this, {
        oauthScopesSelection:       'default',
        scopeConfig:                {
          userInfo:                 'none',
          computeEngine:            'none',
          storage:                  'devstorage.read_only',
          taskQueue:                'none',
          bigQuery:                 'none',
          cloudSQL:                 'none',
          cloudDatastore:           'none',
          stackdriverLoggingAPI:    'logging.write',
          stackdriverMonitoringAPI: 'monitoring',
          cloudPlatform:            'none',
          bigtableData:             'none',
          bigtableAdmin:            'none',
          cloudPub:                 'none',
          serviceControl:           'none',
          serviceManagement:        'service.management.readonly',
          stackdriverTrace:         'trace.append',
          cloudSourceRepositories:  'none',
          cloudDebugger:            'none'
        },
        resourceLabels: [],
        labels:         [],
        taints:         [],
      })
    } else {
      const {
        resourceLabels = [], labels = [], taints = []
      } = config
      let map = {}

      if (resourceLabels) {
        resourceLabels.map((t = '') => {
          const split = t.split('=')

          set(map, split[0], split[1])
        })
        set(this, 'resourceLabels', map)
      }

      if (labels) {
        labels.map((t = '') => {
          const split = t.split('=')

          set(map, split[0], split[1])
        })
        set(this, 'labels', map)
      }

      if (taints) {
        let _taints = taints.map((t = '') => {
          const splitEffect = t.split(':')
          const splitLabel = (splitEffect[1] || '').split('=')

          return {
            effect: splitEffect[0],
            key:    splitLabel[0],
            value:  splitLabel[1],
          }
        })

        set(this, 'taints', _taints)
      } else {
        set(this, 'taints', [])
      }
    }

    set(this, 'initialMasterVersion', get(this, 'config.masterVersion'));
  },

  config: alias('cluster.%%DRIVERNAME%%EngineConfig'),
  /*!!!!!!!!!!!DO NOT CHANGE END!!!!!!!!!!!*/
  step:                   1,
  zones:                  null,
  versions:               null,
  machineTypes:           null,

  initialMasterVersion:   null,
  maintenanceWindowTimes: times,
  eipIdContent:           [],
  imageTypeContent:       imageType,
  clusterAdvanced:        false,
  nodeAdvanced:           false,
  diskTypeContent:        diskType,
  scopeConfig:            {},

  actions: {
    save() {},
    cancel(){
      // probably should not remove this as its what every other driver uses to get back
      get(this, 'router').transitionTo('global-admin.clusters.index');
    },
    clickNext() {
      this.$('BUTTON[type="submit"]').click();
    },

    checkServiceAccount(cb) {
      set(this, 'errors', []);

      return all([
        this.fetchZones(),
        this.fetchVersions(),
        this.fetchMachineTypes()
      ]).then(() => {
        set(this, 'step', 2);
        cb(true);
      }).catch(() => {
        cb(false);
      });
    },
  },


  // Add custom validation beyond what can be done from the config API schema
  validate() {
    // Get generic API validation errors
    this._super();
    var errors = get(this, 'errors')||[];
    if ( !get(this, 'cluster.name') ) {
      errors.push('Name is required');
    }

    // Add more specific errors

    // Check something and add an error entry if it fails:
    // if ( parseInt(get(this, 'config.memorySize'), defaultRadix) < defaultBase ) {
    //   errors.push('Memory Size must be at least 1024 MB');
    // }

    // Set the array of errors for display,
    // and return true if saving should continue.
    if ( get(errors, 'length') ) {
      set(this, 'errors', errors);
      return false;
    } else {
      set(this, 'errors', null);
      return true;
    }
  },

  // Any computed properties or custom logic can go here
  credentialChanged: observer('config.credential', function() {
    const str = get(this, 'config.credential');

    if ( str ) {
      try {
        const obj = JSON.parse(str);
        // Note: this is a Google project id, not ours.
        const projectId = obj.project_id;

        set(this, 'config.projectId', projectId);
      } catch (e) {
      }
    }
  }),

  zoneChanged: observer('config.zone', 'zones.[]', function() {
    const zones = get(this, 'zones') || [];
    const currentZone = zones.findBy('name', get(this, 'config.zone'));

    if ( !currentZone || currentZone.status.toLowerCase() !== 'up' ) {
      const newZone = zones.filter((x) => x.name.startsWith('us-')).find((x) => x.status.toLowerCase() === 'up');

      if ( newZone ) {
        set(this, 'config.zone', newZone.name);
      }
    }

    if ( get(this, 'step') >= 2 ) {
      this.fetchVersions();
      this.fetchMachineTypes();
    }
  }),

  machineTypeChanged: observer('config.machineTypes', 'machineTypes.[]', function() {
    const types = get(this, 'machineTypes') || [];
    const current = types.findBy('name', get(this, 'config.machineType'));

    if ( !current ) {
      set(this, 'config.machineType', get(types, 'firstObject.name'));
    }
  }),

  versionChanged: observer('config.masterVersion', 'versionChoices.[]', function() {
    const versions = get(this, 'versionChoices') || [];
    const current = get(this, 'config.masterVersion');
    const exists = versions.findBy('value', current);

    if ( !exists ) {
      set(this, 'config.masterVersion', versions[0].value);
    }
  }),

  zoneChoices: computed('zones.[]', function() {
    let out = (get(this, 'zones') || []).slice();

    out.forEach((obj) => {
      set(obj, 'sortName', sortableNumericSuffix(obj.name));
      set(obj, 'displayName', `${ obj.name  } (${  obj.description  })`);
      set(obj, 'disabled', obj.status.toLowerCase() !== 'up');
    });

    return out.sortBy('sortName')
  }),

  machineChoices: computed('machineTypes.[]', function() {
    let out = (get(this, 'machineTypes') || []).slice();

    out.forEach((obj) => {
      set(obj, 'sortName', sortableNumericSuffix(obj.name));
      set(obj, 'displayName', `${ obj.name  } (${  obj.description  })`);
    });

    return out.sortBy('sortName')
  }),

  editedMachineChoice: computed('machineChoices', 'config', function() {
    return get(this, 'machineChoices').findBy('name', get(this, 'config.machineType'));
  }),

  versionChoices: computed('versions.validMasterVersions.[]', 'config.masterVersion', function() {
    const versions = get(this, 'versions');

    if ( !versions ) {
      return [];
    }

    const initialMasterVersion = get(this, 'initialMasterVersion');
    let oldestSupportedVersion = '>=1.8.0';

    if ( initialMasterVersion ) {
      oldestSupportedVersion = `>=${  initialMasterVersion }`;
    }

    let out = versions.validMasterVersions.slice();

    out = out.filter((v) => {
      const str = v.replace(/-.*/, '');

      return satisfies(str, oldestSupportedVersion);
    });

    if (get(this, 'editing') &&  !out.includes(initialMasterVersion) ) {
      out.unshift(initialMasterVersion);
    }

    return out.map((v) => {
      return { value: v }
    });
  }),
  fetchZones() {
    return get(this, 'globalStore').rawRequest({
      url:    '/meta/gkeZones',
      method: 'POST',
      data:   {
        credentials: get(this, 'config.credential'),
        projectId:   get(this, 'config.projectId'),
      }
    }).then((xhr) => {
      const out = xhr.body.items;

      set(this, 'zones', out);

      return out;
    }).catch((xhr) => {
      set(this, 'errors', [xhr.body.error]);

      return reject();
    });
  },

  fetchVersions() {
    return get(this, 'globalStore').rawRequest({
      url:    '/meta/gkeVersions',
      method: 'POST',
      data:   {
        credentials: get(this, 'config.credential'),
        projectId:   get(this, 'config.projectId'),
        zone:        get(this, 'config.zone'),
      }
    }).then((xhr) => {
      const out = xhr.body;

      set(this, 'versions', out);
      this.versionChanged();

      return out;
    }).catch((xhr) => {
      set(this, 'errors', [xhr.body.error]);

      return reject();
    });
  },

  fetchMachineTypes() {
    return get(this, 'globalStore').rawRequest({
      url:    '/meta/gkeMachineTypes',
      method: 'POST',
      data:   {
        credentials: get(this, 'config.credential'),
        projectId:   get(this, 'config.projectId'),
        zone:        get(this, 'config.zone'),
      }
    }).then((xhr) => {
      const out = xhr.body.items;

      set(this, 'machineTypes', out);

      return out;
    }).catch((xhr) => {
      set(this, 'errors', [xhr.body.error]);

      return reject();
    });
  },
});
