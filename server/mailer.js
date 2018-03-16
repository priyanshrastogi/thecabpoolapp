var nodemailer = require('nodemailer');
var config = require('./config');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: config.mailUser,
        pass: config.mailPass
    }
});

exports.sendWelcomeMail = function(to, name) {
    const mailOptions = {
        from: '"The Cabpool App" <thecabpoolapp@gmail.com>', // sender address
        to: to, // list of receivers
        subject: 'Welcome to The Cabpool App', // Subject line
        text: 'Hey '+ name+',\n\nWelcome to The Cabpool App.',
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
};

exports.sendWelcome2Mail = function(to, name) {
    const mailOptions = {
        from: '"The Cabpool App" <thecabpoolapp@gmail.com>', // sender address
        to: to, // list of receivers
        subject: 'Welcome to The Cabpool App - Partner', // Subject line
        text: 'Hello'+ name+',\n\nWelcome to The Cabpool App - Partner.',
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
};

exports.sendInterestMail = function (user, poolrequest) {
    const mailOptions = {
        from: '"The Cabpool App" <thecabpoolapp@gmail.com>', // sender address
        to: poolrequest.postedBy.username, // list of receivers
        subject: 'Interest to Your Cabpool Request #'+poolrequest._id, // Subject line
        text: 'Hello ' + poolrequest.postedBy.name + ',\n\n'+ user.name + ' is interested in your cabpool request:\n\n\tFrom: '+poolrequest.from+'\n\tTo: '+
            poolrequest.to+'\n\tDate and Time: '+poolrequest.date+'\n\nOpen the app and accept this interest in \'Response\' tab.',
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
};

exports.sendAcceptMail = function (email, name, poolrequest) {
    const mailOptions = {
        from: '"The Cabpool App" <thecabpoolapp@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Your Cabpool Confirmation', // Subject line
        text: 'Hello '+ name + ',\n\nYour Cab Pool is now confirmed. Here are the details of your ride.\n\n\tFrom: '+poolrequest.from+'\n\tTo: '+
            poolrequest.to+'\n\tDate and Time: '+poolrequest.date+'\n\nYou can contact '+ poolrequest.postedBy.name +' on:\n\tPhone: '
            +poolrequest.postedBy.phone+'\n\tEmail: '+poolrequest.postedBy.username,
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
};

exports.sendDeclineMail = function (email, name, poolrequest) {
    const mailOptions = {
        from: '"The Cabpool App" <thecabpoolapp@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Your Cab Pool Interest Could Not be Confirmed ', // Subject line
        text: 'Hello '+ name + ',\n\nYour Cab Pool Interest to follwoing ride: \n\n\tFrom: '+poolrequest.from+'\n\tTo: '+
            poolrequest.to+'\n\tDate and Time: '+poolrequest.date+'\n\tPosted By: '+ poolrequest.postedBy.name +'\n\n has been denied by the user. You can post a new pool request or find someone else.'
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
};

exports.sendCabRequestMail = function (cabprovider, cabrequest) {
    const mailOptions = {
        from: '"The Cabpool App" <thecabpoolapp@gmail.com>', // sender address
        to: cabprovider.email, // list of receivers
        subject: 'New Cab Request for You!', // Subject line
        text: 'Hello,\n\nYou have a new cabpool request. Details:\n\n\tFrom: '+cabrequest.from+'\n\tTo: '+
            cabrequest.to+'\n\tDate and Time: '+cabrequest.date+'\n\nYou can accept or decline the request from request section of the app. ',
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
};

exports.sendApprovedCabRequestMail = function (cabrequest) {
    const mailOptions = {
        from: '"The Cabpool App" <thecabpoolapp@gmail.com>', // sender address
        to: cabrequest.postedBy.username, // list of receivers
        subject: 'Your Cab has been Confirmed!', // Subject line
        text: 'Hello,\n\nYou have a new cabpool request. Details:\n\n\tFrom: ' + cabrequest.from + '\n\tTo: ' +
        cabrequest.to + '\n\tDate and Time: ' + cabrequest.date + '\n\nYou can accept or decline the request from request section of the app. ',
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
};

exports.sendDeclinedCabRequestMail = function (cabrequest) {
    const mailOptions = {
        from: '"The Cabpool App" <thecabpoolapp@gmail.com>', // sender address
        to: cabprovider.em, // list of receivers
        subject: 'New Cab Request for You!', // Subject line
        text: 'Hello,\n\nYou have a new cabpool request. Details:\n\n\tFrom: ' + cabrequest.from + '\n\tTo: ' +
        cabrequest.to + '\n\tDate and Time: ' + cabrequest.date + '\n\nYou can accept or decline the request from request section of the app. ',
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            console.log(err)
        else
            console.log(info);
    });
};