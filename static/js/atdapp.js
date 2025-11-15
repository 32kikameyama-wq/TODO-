class ATDApp {
    constructor(options = {}) {
        this.version = options.version || '1.0.0';
        this.environment = options.environment || (window.ATD_ENV || 'production');
        this.loggerEnabled = options.loggerEnabled ?? this.environment !== 'production';
        this.state = {
            user: options.user || null,
            teams: options.teams || [],
            tasks: options.tasks || []
        };
    }

    log(...args) {
        if (this.loggerEnabled) {
            console.log('[ATDApp]', ...args);
        }
    }

    init() {
        this.log(`ATDApp v${this.version} initialized (${this.environment})`);
        document.dispatchEvent(new CustomEvent('ATDApp:ready', {
            detail: {
                version: this.version,
                environment: this.environment,
                state: this.snapshot
            }
        }));
    }

    setUser(user) {
        this.state.user = user;
        this.log('User updated', user);
        this._emitStateChange();
    }

    setTeams(teams) {
        this.state.teams = Array.isArray(teams) ? teams : [];
        this.log('Teams updated', this.state.teams);
        this._emitStateChange();
    }

    setTasks(tasks) {
        this.state.tasks = Array.isArray(tasks) ? tasks : [];
        this.log('Tasks updated', this.state.tasks);
        this._emitStateChange();
    }

    _emitStateChange() {
        document.dispatchEvent(new CustomEvent('ATDApp:state', {
            detail: this.snapshot
        }));
    }

    get snapshot() {
        return {
            user: this.state.user,
            teams: [...this.state.teams],
            tasks: [...this.state.tasks]
        };
    }
}

window.ATDApp = ATDApp;

if (!window.__ATD_APP_AUTO_INIT__) {
    window.__ATD_APP_AUTO_INIT__ = true;
    document.addEventListener('DOMContentLoaded', () => {
        if (window.atdAppInstance) {
            return;
        }
        const config = window.ATD_INITIAL_CONFIG || {};
        window.atdAppInstance = new ATDApp(config);
        try {
            window.atdAppInstance.init();
        } catch (error) {
            console.error('[ATDApp] initialization error', error);
        }
    });
}

