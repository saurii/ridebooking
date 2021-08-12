class Statuscodes {

    static _statuscodeprefix = 's';

    statuscodesface = {
        '001': { code: '001', message: 'status code not defined', ispopup: true },
        '400': { code: '400', message: 'you are unauthorized to access this api', ispopup: true },
        '401': { code: '401', message: 'unauthozied', ispopup: true },
        '402': { code: '402', message: '#key1# created successfully', ispopup: true },
        '403': { code: '403', message: '#key1# already exist', ispopup: true },
        '404': { code: '404', message: 'data fetched successfully', ispopup: false },
        '405': { code: '405', message: 'records not found', ispopup: false },
        '406': { code: '406', message: '#key1# updated successfully', ispopup: true },
        '407': { code: '407', message: 'pass data to update details', ispopup: true },
        '408': { code: '408', message: 'logged in successfully', ispopup: true },
        '409': { code: '409', message: 'username/password is incorrect, please try again', ispopup: true },
        '410': { code: '410', message: 'you have no longer access to this api', ispopup: true },
        '411': { code: '411', message: '#key1# delete successfully', ispopup: true },
        '412': { code: '412', message: 'invalid api parameters', ispopup: true },
        '413': { code: '413', message: 'you have already added a one car', ispopup: true },
        '414': { code: '414', message: 'car added successfully', ispopup: true },
        '415': { code: '415', message: 'no nearby cabs available, try again', ispopup: true },
        '416': { code: '416', message: 'your cab is booked', ispopup: true },
        '417': { code: '417', message: 'you cannnot booked multiple cab at same time for same user', ispopup: true },
        '418': { code: '418', message: 'ride is not booked or start', ispopup: true },
        '419': { code: '419', message: 'your ride is #key1#', ispopup: true },
        '420': { code: '420', message: '#key1#', ispopup: true },
        '1015': { code: '1015', message: 'an error occured, please contact to system administrator', ispopup: true }
    }

    getStatusDetails(key) {
        return this.statuscodesface[key];
    }
}

module.exports.Statuscodes = Statuscodes;