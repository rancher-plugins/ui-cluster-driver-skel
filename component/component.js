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
const resolve        = Ember.RSVP.resolve;

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
  config:      alias('cluster.%%DRIVERNAME%%EngineConfig'),
  app:         service(),
  router:      service(),
  layout:      null,
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
        type:                               configField,
        clusterIpv4Cidr:                    '',
        description:                        '',
        diskSizeGb:                         100,
        diskType:                           'pd-standard',
        displayName:                        '',
        enableAlphaFeature:                 false,
        enableAutoRepair:                   false,
        enableAutoUpgrade:                  false,
        enableHorizontalPodAutoscaling:     true,
        enableHttpLoadBalancing:            true,
        enableKubernetesDashboard:          false,
        enableLegacyAbac:                   false,
        enableMasterAuthorizedNetwork:      false,
        enableNetworkPolicyConfig:          true,
        enableNodepoolAutoscaling:          false,
        enablePrivateEndpoint:              false,
        enablePrivateNodes:                 false,
        enableStackdriverLogging:           true,
        enableStackdriverMonitoring:        true,
        gkeCredentialPath:                  '',
        imageType:                          'UBUNTU',
        ipPolicyClusterIpv4CidrBlock:       '',
        ipPolicyClusterSecondaryRangeName:  '',
        ipPolicyCreateSubnetwork:           false,
        ipPolicyNodeIpv4CidrBlock:          '',
        ipPolicyServicesIpv4CidrBlock:      '',
        ipPolicyServicesSecondaryRangeName: '',
        ipPolicySubnetworkName:             '',
        issueClientCertificate:             false,
        kubernetesDashboard:                false,
        localSsdCount:                      0,
        machineType:                        'g1-small',
        maintenanceWindow:                  '',
        masterIpv4CidrBlock:                '',
        masterVersion:                      '1.11.7-gke.6',
        maxNodeCount:                       1,
        minNodeCount:                       1,
        name:                               '',
        network:                            'default',
        nodeCount:                          3,
        nodePool:                           '',
        nodeVersion:                        '',
        preemptible:                        false,
        projectId:                          '',
        serviceAccount:                     '',
        subNetwork:                         '',
        useIpAliases:                       false,
        zone:                               'us-central1-f',
        taints:                             [],
        credential:                         '',
        resourceLabels:                     [],
        labels:                             []
      });

      set(this, `cluster.${ configField }`, config);

      set(this, 'cluster.driver', get(this, 'driverName'));

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
  isSavingCluster:        false,

  actions: {
    driverSave(cb) {
      cb = cb || function() {};

      set(this, 'isSavingCluster', true);

      resolve(this.willSave()).then((ok) => {
        if ( !ok ) {
          // Validation or something else said not to save
          cb(false);
          set(this, 'isSavingCluster', false);

          return;
        }

        this.sendAction('save', (ok) => {
          if ( ok ) {
            this.doneSaving().finally(() => {
              set(this, 'isSavingCluster', false);
              cb(ok);
            });
          } else {
            set(this, 'isSavingCluster', false);
            cb(ok);
          }
        });
      });
    },

    clickNext() {
      this.$('BUTTON[type="submit"]').click();
    },

    checkServiceAccount(cb) {
      set(this, 'errors', []);

      return all([
        this.fetchZones(),
        this.fetchVersions(),
        this.fetchMachineTypes(),
        this.fetchNetworks(),
        this.fetchSubnetworks(),
        this.fetchServiceAccounts(),
      ]).then(() => {
        set(this, 'step', 2);
        cb(true);
      }).catch(() => {
        cb(false);
      });
    },

    setLabels(section) {
      const out = []

      for (let key in section) {
        out.pushObject(`${ key }=${ section[key] }`)
      }

      set(this, 'config.resourceLabels', out);
    },

    setNodeLabels(section) {
      const out = []

      for (let key in section) {
        out.pushObject(`${ key }=${ section[key] }`)
      }

      set(this, 'config.labels', out);
    },

    updateNameservers(nameservers) {
      set(this, 'config.masterAuthorizedNetworkCidrBlocks', nameservers);
    },

    setTaints(value) {
      set(this, 'config.taints', value);
    },
  },

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

    if (!get(this, 'isSavingCluster')) {
      this.fetchVersions();
      this.fetchMachineTypes();
      this.fetchNetworks();
      this.fetchSubnetworks();
      this.fetchServiceAccounts();
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
    const exists = versions[versions.indexOf(current)];

    if ( !exists ) {
      set(this, 'config.masterVersion', versions[0]);
    }
  }),

  networkChange: observer('config.network', 'subNetworkContent.[]', function() {
    const subNetworkContent = get(this, 'subNetworkContent') || []

    if (subNetworkContent.length > 0) {
      set(this, 'config.subNetwork', subNetworkContent[0] && subNetworkContent[0].value)
      const secondaryIpRangeContent = get(this, 'secondaryIpRangeContent') || []

      if (secondaryIpRangeContent.length > 0) {
        const value = secondaryIpRangeContent[0] && secondaryIpRangeContent[0].value

        setProperties(this, {
          'config.ipPolicyClusterSecondaryRangeName':  value,
          'config.ipPolicyServicesSecondaryRangeName': value,
        })
      }
    }
  }),

  secondaryIpRangeContentChange: observer('secondaryIpRangeContent.[]', 'config.useIpAliases', function() {
    const secondaryIpRangeContent = get(this, 'secondaryIpRangeContent') || []

    if (secondaryIpRangeContent.length === 0) {
      set(this, 'config.ipPolicyCreateSubnetwork', true)
    }
  }),

  useIpAliasesChange: observer('config.useIpAliases', function() {
    if (!get(this, 'config.useIpAliases')) {
      set(this, 'config.enablePrivateNodes', false)
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
    return get(this, 'versions.validMasterVersions');
  }),

  locationContent: computed('config.zone', function() {
    const zone = get(this, 'config.zone')
    const arr = zone.split('-')
    const locationName = `${ arr[0] }-${ arr[1] }`
    const zoneChoices = get(this, 'zoneChoices')

    return zoneChoices.filter((z) => (z.name || '').startsWith(locationName) && z.name !== zone)
  }),

  networkContent: computed('nerworks', function() {
    return get(this, 'networks')
  }),

  subNetworkContent: computed('subNetworks.[]', 'config.network', function() {
    const subNetworks = get(this, 'subNetworks') || []
    const networkName = get(this, 'config.network')

    const out = subNetworks.filter((s) => {
      const { network = '' } = s
      const arr = network.split('/') || []
      const networkDisplayName = arr[arr.length - 1]

      if (networkDisplayName === networkName) {
        return true
      }
    })

    return out.map((o) => {
      return {
        label:             `${ o.name }(${ o.ipCidrRange })`,
        value:             o.name,
        secondaryIpRanges: o.secondaryIpRanges,
      }
    })
  }),

  secondaryIpRangeContent: computed('subNetworkContent.[]', 'config.network', function() {
    const subNetworkContent = get(this, 'subNetworkContent')
    const { secondaryIpRanges = [] } = subNetworkContent

    return secondaryIpRanges.map((s) => {
      return {
        lable: `${ s.rangeName }(${ s.ipCidrRange })`,
        value: s.rangeName,
      }
    })
  }),

  serviceAccountContent: computed('serviceAccounts', function() {
    const serviceAccounts = get(this, 'serviceAccounts')

    return serviceAccounts
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
      const locations = get(this, 'config.locations') || []

      if (locations.length > 0) {
        out.map((o) => {
          if (locations.includes(o.name)) {
            set(o, 'checked', true)
          }
        })
      }
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

  fetchNetworks() {
    return get(this, 'globalStore').rawRequest({
      url:    '/meta/gkeNetworks',
      method: 'POST',
      data:   {
        credentials: get(this, 'config.credential'),
        projectId:   get(this, 'config.projectId'),
        zone:        get(this, 'config.zone'),
      }
    }).then((xhr) => {
      const out = xhr.body.items || [];

      set(this, 'networks', out);

      if (get(this, 'mode') === 'new') {
        set(this, 'config.network', out[0] && out[0].name)
      }

      return out;
    }).catch((xhr) => {
      set(this, 'errors', [xhr.body.error]);

      return reject();
    });
  },

  fetchSubnetworks() {
    const zone = get(this, 'config.zone')
    const zoneSplit = zone.split('-')

    return get(this, 'globalStore').rawRequest({
      url:    '/meta/gkeSubnetworks',
      method: 'POST',
      data:   {
        credentials: get(this, 'config.credential'),
        projectId:   get(this, 'config.projectId'),
        region:      `${ zoneSplit[0] }-${ zoneSplit[1] }`,
      }
    }).then((xhr) => {
      const out = xhr.body.items || [];

      set(this, 'subNetworks', out);

      return out;
    }).catch((xhr) => {
      set(this, 'errors', [xhr.body.error]);

      return reject();
    });
  },

  fetchServiceAccounts() {
    return get(this, 'globalStore').rawRequest({
      url:    '/meta/gkeServiceAccounts',
      method: 'POST',
      data:   {
        credentials: get(this, 'config.credential'),
        projectId:   get(this, 'config.projectId'),
        zone:        get(this, 'config.zone'),
      }
    }).then((xhr) => {
      const out = xhr.body.accounts || [];

      set(this, 'serviceAccounts', out);
      const filter = out.filter((o) => o.displayName === 'Compute Engine default service account')

      if (get(this, 'mode') === 'new') {
        set(this, 'config.serviceAccount', filter[0] && filter[0].uniqueId)
      }

      return out;
    }).catch((xhr) => {
      set(this, 'errors', [xhr.body.error]);

      return reject();
    });
  },

  validate() {
    const model = get(this, 'cluster');
    const errors = model.validationErrors();
    const { intl, config = {} } = this
    const { minNodeCount, maxNodeCount } = config

    if (maxNodeCount < minNodeCount) {
      errors.pushObject(intl.t('clusterNew.googlegke.maxNodeCount.minError'))
    }

    if (!get(this, 'cluster.name')) {
      errors.pushObject(intl.t('clusterNew.name.required'))
    }

    const taints = get(this, 'taints') || []

    if (taints.length > 0) {
      const filter = taints.filter((t) => !t.key || !t.value)

      if (filter.length > 0) {
        errors.pushObject(intl.t('clusterNew.googlegke.taints.required'))
      }
    }

    set(this, 'errors', errors);

    return errors.length === 0;
  },

});
