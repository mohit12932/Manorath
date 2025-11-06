import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:intl/intl.dart';
import 'package:email_validator/email_validator.dart';
import 'package:country_code_picker/country_code_picker.dart';
import '../../services/api_client.dart';

class SignupScreen extends StatefulWidget {
  final String? mobile;
  final String? countryCode;
  final String? mobileNumber;

  const SignupScreen({
    super.key,
    this.mobile,
    this.countryCode,
    this.mobileNumber,
  });

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _fullNameController = TextEditingController();
  final _dobController = TextEditingController();
  final _emailController = TextEditingController();
  final _mobileController = TextEditingController();
  final _designationController = TextEditingController();
  final _stateController = TextEditingController();
  final _districtController = TextEditingController();
  final _whatsappController = TextEditingController();
  final _addressController = TextEditingController();
  final _pinCodeController = TextEditingController();
  final _apiClient = ApiClient();

  File? _profileImage;
  String? _profileImagePath;
  DateTime? _selectedDate;
  String _selectedGender = 'Prefer not to say';
  String _selectedDesignationLevel = 'Select Level';
  String _selectedOrgType = 'Select Type';
  String _countryCode = '+91';
  String _whatsappCountryCode = '+91';
  bool _isLoading = false;
  String? _errorMessage;
  bool _isFormValid = false;

  final List<String> _genders = [
    'Male',
    'Female',
    'Other',
    'Prefer not to say',
  ];

  final List<String> _designationLevels = [
    'Select Level',
    'Entry Level',
    'Junior',
    'Mid-Level',
    'Senior',
    'Lead',
    'Manager',
    'Senior Manager',
    'Director',
    'Vice President',
    'C-Level',
  ];

  final List<String> _organisationTypes = [
    'Select Type',
    'Government',
    'Private Company',
    'Public Sector',
    'Non-Profit/NGO',
    'Educational Institution',
    'Healthcare',
    'Startup',
    'MNC',
    'Self-Employed',
    'Other',
  ];

  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
    _initializeFields();
    _validateForm();
  }

  void _initializeAnimations() {
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: const Interval(0.0, 0.6, curve: Curves.easeOut),
      ),
    );

    _slideAnimation =
        Tween<Offset>(begin: const Offset(0, 0.1), end: Offset.zero).animate(
          CurvedAnimation(
            parent: _animationController,
            curve: const Interval(0.2, 1.0, curve: Curves.easeOutCubic),
          ),
        );

    _animationController.forward();
  }

  void _initializeFields() {
    if (widget.mobileNumber != null) {
      _mobileController.text = widget.mobileNumber!;
    }
    if (widget.countryCode != null) {
      _countryCode = widget.countryCode!;
    }
  }

  @override
  void dispose() {
    _fullNameController.dispose();
    _dobController.dispose();
    _emailController.dispose();
    _mobileController.dispose();
    _designationController.dispose();
    _stateController.dispose();
    _districtController.dispose();
    _whatsappController.dispose();
    _addressController.dispose();
    _pinCodeController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  void _validateForm() {
    setState(() {
      _isFormValid =
          _fullNameController.text.trim().split(' ').length >= 2 &&
          _selectedDate != null &&
          _mobileController.text.length >= 10 &&
          (_emailController.text.isEmpty ||
              EmailValidator.validate(_emailController.text)) &&
          _selectedDesignationLevel != 'Select Level' &&
          _designationController.text.isNotEmpty &&
          _stateController.text.isNotEmpty &&
          _districtController.text.isNotEmpty &&
          _selectedOrgType != 'Select Type' &&
          _whatsappController.text.length >= 10 &&
          _addressController.text.isNotEmpty &&
          _pinCodeController.text.length == 6;
    });
  }

  String? _validateFullName(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Full name is required';
    }
    final words = value.trim().split(RegExp(r'\s+'));
    if (words.length < 2) {
      return 'Please enter at least first and last name';
    }
    return null;
  }

  String? _validateEmail(String? value) {
    if (value != null && value.isNotEmpty) {
      if (!EmailValidator.validate(value)) {
        return 'Please enter a valid email';
      }
    }
    return null;
  }

  String? _validateMobile(String? value) {
    if (value == null || value.isEmpty) {
      return 'Mobile number is required';
    }
    if (value.length < 10) {
      return 'Enter a valid mobile number';
    }
    if (!RegExp(r'^\d+$').hasMatch(value)) {
      return 'Only numbers allowed';
    }
    return null;
  }

  String? _validateDesignation(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Designation is required';
    }
    return null;
  }

  String? _validateState(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'State is required';
    }
    return null;
  }

  String? _validateDistrict(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'District is required';
    }
    return null;
  }

  String? _validateWhatsapp(String? value) {
    if (value == null || value.isEmpty) {
      return 'WhatsApp number is required';
    }
    if (value.length < 10) {
      return 'Enter a valid WhatsApp number';
    }
    if (!RegExp(r'^\d+$').hasMatch(value)) {
      return 'Only numbers allowed';
    }
    return null;
  }

  String? _validateAddress(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Full address is required';
    }
    if (value.trim().length < 10) {
      return 'Please enter complete address';
    }
    return null;
  }

  String? _validatePinCode(String? value) {
    if (value == null || value.isEmpty) {
      return 'Pin code is required';
    }
    if (value.length != 6) {
      return 'Pin code must be 6 digits';
    }
    if (!RegExp(r'^\d+$').hasMatch(value)) {
      return 'Only numbers allowed';
    }
    return null;
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final picker = ImagePicker();
      final XFile? image = await picker.pickImage(
        source: source,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85,
      );

      if (image != null) {
        // Compress image
        final compressedImage = await _compressImage(File(image.path));

        setState(() {
          _profileImage = compressedImage;
          _profileImagePath = compressedImage.path;
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Failed to pick image: $e')));
    }
  }

  Future<File> _compressImage(File file) async {
    final filePath = file.absolute.path;
    final lastIndex = filePath.lastIndexOf('.');
    final splitPath = filePath.substring(0, lastIndex);
    final outPath = "${splitPath}_compressed.jpg";

    var result = await FlutterImageCompress.compressAndGetFile(
      file.absolute.path,
      outPath,
      quality: 70,
      minWidth: 800,
      minHeight: 800,
    );

    // Check file size
    if (result != null) {
      final fileSize = await result.length();
      if (fileSize > 300000) {
        // If still > 300KB, compress more
        result = await FlutterImageCompress.compressAndGetFile(
          file.absolute.path,
          outPath,
          quality: 50,
          minWidth: 600,
          minHeight: 600,
        );
      }
    }

    return result != null ? File(result.path) : file;
  }

  void _showImageSourceDialog() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return SafeArea(
          child: Wrap(
            children: [
              ListTile(
                leading: const Icon(Icons.camera_alt),
                title: const Text('Camera'),
                onTap: () {
                  Navigator.pop(context);
                  _pickImage(ImageSource.camera);
                },
              ),
              ListTile(
                leading: const Icon(Icons.photo_library),
                title: const Text('Gallery'),
                onTap: () {
                  Navigator.pop(context);
                  _pickImage(ImageSource.gallery);
                },
              ),
              if (_profileImage != null)
                ListTile(
                  leading: const Icon(Icons.delete, color: Colors.red),
                  title: const Text('Remove Photo'),
                  onTap: () {
                    Navigator.pop(context);
                    setState(() {
                      _profileImage = null;
                      _profileImagePath = null;
                    });
                  },
                ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _selectDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().subtract(const Duration(days: 365 * 18)),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
      helpText: 'Select Date of Birth',
    );

    if (picked != null) {
      setState(() {
        _selectedDate = picked;
        _dobController.text = DateFormat('dd-MM-yyyy').format(picked);
        _validateForm();
      });
    }
  }

  Future<void> _handleSignup() async {
    if (!_formKey.currentState!.validate()) return;
    if (!_isFormValid) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final payload = {
        'fullName': _fullNameController.text.trim(),
        'dob': _selectedDate!.toIso8601String(),
        'gender': _selectedGender,
        'email': _emailController.text.trim(),
        'mobile': '$_countryCode${_mobileController.text.trim()}',
        'designationLevel': _selectedDesignationLevel,
        'designation': _designationController.text.trim(),
        'state': _stateController.text.trim(),
        'district': _districtController.text.trim(),
        'organisationType': _selectedOrgType,
        'whatsappNumber':
            '$_whatsappCountryCode${_whatsappController.text.trim()}',
        'fullAddress': _addressController.text.trim(),
        'pinCode': _pinCodeController.text.trim(),
      };

      // Upload photo if selected
      if (_profileImagePath != null) {
        final photoResponse = await _apiClient.uploadProfilePhoto(
          _profileImagePath!,
        );
        payload['profilePhoto'] = photoResponse['data']['photoUrl'];
      }

      // Dummy API call - in production this would call real backend
      await Future.delayed(const Duration(seconds: 2));
      final response = {
        'success': true,
        'message': 'Account created successfully',
      };

      if (!mounted) return;

      if (response['success'] == true) {
        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Account created successfully!'),
            backgroundColor: Colors.green,
          ),
        );

        // Navigate to dashboard after signup
        Navigator.pushReplacementNamed(context, '/dashboard');
      } else {
        setState(() {
          _errorMessage = response['message']?.toString() ?? 'Signup failed';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final gradientColors = isDarkMode
        ? [const Color(0xFF020617), const Color(0xFF0B1220)]
        : [const Color(0xFF0F172A), const Color(0xFF1E3A8A)];

    return Scaffold(
      body: Stack(
        children: [
          // Gradient Header
          Container(
            height: MediaQuery.of(context).size.height * 0.25,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: gradientColors,
              ),
            ),
          ),

          SafeArea(
            child: AnimatedBuilder(
              animation: _animationController,
              builder: (context, child) {
                return FadeTransition(
                  opacity: _fadeAnimation,
                  child: SlideTransition(
                    position: _slideAnimation,
                    child: Column(
                      children: [
                        // Header
                        Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              IconButton(
                                onPressed: () => Navigator.pop(context),
                                icon: const Icon(
                                  Icons.arrow_back,
                                  color: Colors.white,
                                ),
                                style: IconButton.styleFrom(
                                  backgroundColor: Colors.white.withOpacity(
                                    0.2,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 12),
                              const Text(
                                'Create Account',
                                style: TextStyle(
                                  fontSize: 28,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'Fill in your details to get started',
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.white.withOpacity(0.9),
                                ),
                              ),
                            ],
                          ),
                        ),

                        // Form Section
                        Expanded(
                          child: Container(
                            decoration: BoxDecoration(
                              color: Theme.of(context).scaffoldBackgroundColor,
                              borderRadius: const BorderRadius.only(
                                topLeft: Radius.circular(30),
                                topRight: Radius.circular(30),
                              ),
                            ),
                            child: SingleChildScrollView(
                              padding: const EdgeInsets.all(24.0),
                              child: Form(
                                key: _formKey,
                                onChanged: _validateForm,
                                child: Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.stretch,
                                  children: [
                                    const SizedBox(height: 24),

                                    // Profile Photo Upload
                                    Center(
                                      child: Stack(
                                        children: [
                                          Container(
                                            width: 120,
                                            height: 120,
                                            decoration: BoxDecoration(
                                              shape: BoxShape.circle,
                                              color: isDarkMode
                                                  ? Colors.grey[850]
                                                  : Colors.grey[200],
                                              image: _profileImage != null
                                                  ? DecorationImage(
                                                      image: FileImage(
                                                        _profileImage!,
                                                      ),
                                                      fit: BoxFit.cover,
                                                    )
                                                  : null,
                                            ),
                                            child: _profileImage == null
                                                ? Icon(
                                                    Icons.person,
                                                    size: 60,
                                                    color: Colors.grey,
                                                  )
                                                : null,
                                          ),
                                          Positioned(
                                            bottom: 0,
                                            right: 0,
                                            child: GestureDetector(
                                              onTap: _showImageSourceDialog,
                                              child: Container(
                                                padding: const EdgeInsets.all(
                                                  8,
                                                ),
                                                decoration: BoxDecoration(
                                                  color: gradientColors[0],
                                                  shape: BoxShape.circle,
                                                  border: Border.all(
                                                    color: Theme.of(
                                                      context,
                                                    ).scaffoldBackgroundColor,
                                                    width: 3,
                                                  ),
                                                ),
                                                child: const Icon(
                                                  Icons.camera_alt,
                                                  color: Colors.white,
                                                  size: 20,
                                                ),
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),

                                    const SizedBox(height: 32),

                                    // Full Name
                                    _buildLabel('Full Name *'),
                                    TextFormField(
                                      controller: _fullNameController,
                                      textCapitalization:
                                          TextCapitalization.words,
                                      decoration: _buildInputDecoration(
                                        'Enter first and last name',
                                        Icons.person_outline,
                                        isDarkMode,
                                      ),
                                      validator: _validateFullName,
                                    ),

                                    const SizedBox(height: 20),

                                    // Date of Birth
                                    _buildLabel('Date of Birth *'),
                                    TextFormField(
                                      controller: _dobController,
                                      readOnly: true,
                                      onTap: _selectDate,
                                      decoration: _buildInputDecoration(
                                        'Select date',
                                        Icons.calendar_today_outlined,
                                        isDarkMode,
                                      ),
                                      validator: (value) {
                                        if (_selectedDate == null) {
                                          return 'Date of birth is required';
                                        }
                                        return null;
                                      },
                                    ),

                                    const SizedBox(height: 20),

                                    // Gender
                                    _buildLabel('Gender'),
                                    DropdownButtonFormField<String>(
                                      value: _selectedGender,
                                      decoration: _buildInputDecoration(
                                        'Select gender',
                                        Icons.wc_outlined,
                                        isDarkMode,
                                      ),
                                      items: _genders.map((gender) {
                                        return DropdownMenuItem(
                                          value: gender,
                                          child: Text(gender),
                                        );
                                      }).toList(),
                                      onChanged: (value) {
                                        if (value != null) {
                                          setState(() {
                                            _selectedGender = value;
                                          });
                                        }
                                      },
                                    ),

                                    const SizedBox(height: 20),

                                    // Email (Optional)
                                    _buildLabel('Email (Optional)'),
                                    TextFormField(
                                      controller: _emailController,
                                      keyboardType: TextInputType.emailAddress,
                                      decoration: _buildInputDecoration(
                                        'Enter email address',
                                        Icons.email_outlined,
                                        isDarkMode,
                                      ),
                                      validator: _validateEmail,
                                    ),

                                    const SizedBox(height: 20),

                                    // Mobile Number
                                    _buildLabel('Mobile Number *'),
                                    Container(
                                      decoration: BoxDecoration(
                                        color: isDarkMode
                                            ? Colors.grey[850]
                                            : Colors.grey[100],
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Row(
                                        children: [
                                          CountryCodePicker(
                                            onChanged: (country) {
                                              setState(() {
                                                _countryCode =
                                                    country.dialCode!;
                                              });
                                            },
                                            initialSelection: 'IN',
                                            favorite: const ['+91', 'IN'],
                                            showCountryOnly: false,
                                            showOnlyCountryWhenClosed: false,
                                            alignLeft: false,
                                            padding: EdgeInsets.zero,
                                            textStyle: TextStyle(
                                              fontSize: 16,
                                              color: Theme.of(
                                                context,
                                              ).textTheme.bodyLarge?.color,
                                            ),
                                            enabled: widget.mobile == null,
                                          ),
                                          Expanded(
                                            child: TextFormField(
                                              controller: _mobileController,
                                              keyboardType: TextInputType.phone,
                                              maxLength: 10,
                                              enabled: widget.mobile == null,
                                              inputFormatters: [
                                                FilteringTextInputFormatter
                                                    .digitsOnly,
                                              ],
                                              decoration: const InputDecoration(
                                                hintText: 'Enter mobile number',
                                                border: InputBorder.none,
                                                counterText: '',
                                                contentPadding:
                                                    EdgeInsets.symmetric(
                                                      horizontal: 16,
                                                      vertical: 16,
                                                    ),
                                              ),
                                              validator: _validateMobile,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),

                                    const SizedBox(height: 20),

                                    // Designation Level
                                    _buildLabel('Designation Level *'),
                                    DropdownButtonFormField<String>(
                                      value: _selectedDesignationLevel,
                                      decoration: _buildInputDecoration(
                                        'Select designation level',
                                        Icons.work_outline,
                                        isDarkMode,
                                      ),
                                      items: _designationLevels.map((level) {
                                        return DropdownMenuItem(
                                          value: level,
                                          child: Text(level),
                                        );
                                      }).toList(),
                                      onChanged: (value) {
                                        if (value != null) {
                                          setState(() {
                                            _selectedDesignationLevel = value;
                                            _validateForm();
                                          });
                                        }
                                      },
                                      validator: (value) {
                                        if (value == null ||
                                            value == 'Select Level') {
                                          return 'Please select designation level';
                                        }
                                        return null;
                                      },
                                    ),

                                    const SizedBox(height: 20),

                                    // Designation
                                    _buildLabel('Designation *'),
                                    TextFormField(
                                      controller: _designationController,
                                      textCapitalization:
                                          TextCapitalization.words,
                                      decoration: _buildInputDecoration(
                                        'Enter your designation',
                                        Icons.badge_outlined,
                                        isDarkMode,
                                      ),
                                      validator: _validateDesignation,
                                    ),

                                    const SizedBox(height: 20),

                                    // State
                                    _buildLabel('State *'),
                                    TextFormField(
                                      controller: _stateController,
                                      textCapitalization:
                                          TextCapitalization.words,
                                      decoration: _buildInputDecoration(
                                        'Enter your state',
                                        Icons.location_city_outlined,
                                        isDarkMode,
                                      ),
                                      validator: _validateState,
                                    ),

                                    const SizedBox(height: 20),

                                    // District
                                    _buildLabel('District *'),
                                    TextFormField(
                                      controller: _districtController,
                                      textCapitalization:
                                          TextCapitalization.words,
                                      decoration: _buildInputDecoration(
                                        'Enter your district',
                                        Icons.place_outlined,
                                        isDarkMode,
                                      ),
                                      validator: _validateDistrict,
                                    ),

                                    const SizedBox(height: 20),

                                    // Organisation Type
                                    _buildLabel('Organisation Type *'),
                                    DropdownButtonFormField<String>(
                                      value: _selectedOrgType,
                                      decoration: _buildInputDecoration(
                                        'Select organisation type',
                                        Icons.business_outlined,
                                        isDarkMode,
                                      ),
                                      items: _organisationTypes.map((type) {
                                        return DropdownMenuItem(
                                          value: type,
                                          child: Text(type),
                                        );
                                      }).toList(),
                                      onChanged: (value) {
                                        if (value != null) {
                                          setState(() {
                                            _selectedOrgType = value;
                                            _validateForm();
                                          });
                                        }
                                      },
                                      validator: (value) {
                                        if (value == null ||
                                            value == 'Select Type') {
                                          return 'Please select organisation type';
                                        }
                                        return null;
                                      },
                                    ),

                                    const SizedBox(height: 20),

                                    // WhatsApp Number
                                    _buildLabel('WhatsApp Number *'),
                                    Container(
                                      decoration: BoxDecoration(
                                        color: isDarkMode
                                            ? Colors.grey[850]
                                            : Colors.grey[100],
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Row(
                                        children: [
                                          CountryCodePicker(
                                            onChanged: (country) {
                                              setState(() {
                                                _whatsappCountryCode =
                                                    country.dialCode!;
                                              });
                                            },
                                            initialSelection: 'IN',
                                            favorite: const ['+91', 'IN'],
                                            showCountryOnly: false,
                                            showOnlyCountryWhenClosed: false,
                                            alignLeft: false,
                                            padding: EdgeInsets.zero,
                                            textStyle: TextStyle(
                                              fontSize: 16,
                                              color: Theme.of(
                                                context,
                                              ).textTheme.bodyLarge?.color,
                                            ),
                                          ),
                                          Expanded(
                                            child: TextFormField(
                                              controller: _whatsappController,
                                              keyboardType: TextInputType.phone,
                                              maxLength: 10,
                                              inputFormatters: [
                                                FilteringTextInputFormatter
                                                    .digitsOnly,
                                              ],
                                              decoration: const InputDecoration(
                                                hintText:
                                                    'Enter WhatsApp number',
                                                border: InputBorder.none,
                                                counterText: '',
                                                contentPadding:
                                                    EdgeInsets.symmetric(
                                                      horizontal: 16,
                                                      vertical: 16,
                                                    ),
                                              ),
                                              validator: _validateWhatsapp,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),

                                    const SizedBox(height: 20),

                                    // Full Address
                                    _buildLabel('Full Address *'),
                                    TextFormField(
                                      controller: _addressController,
                                      textCapitalization:
                                          TextCapitalization.sentences,
                                      maxLines: 3,
                                      decoration: _buildInputDecoration(
                                        'Enter your complete address',
                                        Icons.home_outlined,
                                        isDarkMode,
                                      ),
                                      validator: _validateAddress,
                                    ),

                                    const SizedBox(height: 20),

                                    // Pin Code
                                    _buildLabel('Pin Code *'),
                                    TextFormField(
                                      controller: _pinCodeController,
                                      keyboardType: TextInputType.number,
                                      maxLength: 6,
                                      inputFormatters: [
                                        FilteringTextInputFormatter.digitsOnly,
                                      ],
                                      decoration: _buildInputDecoration(
                                        'Enter 6-digit pin code',
                                        Icons.pin_drop_outlined,
                                        isDarkMode,
                                      ).copyWith(counterText: ''),
                                      validator: _validatePinCode,
                                    ),

                                    // Error Message
                                    if (_errorMessage != null) ...[
                                      const SizedBox(height: 16),
                                      Container(
                                        padding: const EdgeInsets.all(12),
                                        decoration: BoxDecoration(
                                          color: Colors.red.withOpacity(0.1),
                                          borderRadius: BorderRadius.circular(
                                            8,
                                          ),
                                          border: Border.all(
                                            color: Colors.red.withOpacity(0.3),
                                          ),
                                        ),
                                        child: Row(
                                          children: [
                                            const Icon(
                                              Icons.error_outline,
                                              color: Colors.red,
                                              size: 20,
                                            ),
                                            const SizedBox(width: 8),
                                            Expanded(
                                              child: Text(
                                                _errorMessage!,
                                                style: const TextStyle(
                                                  color: Colors.red,
                                                  fontSize: 14,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],

                                    const SizedBox(height: 32),

                                    // Create Account Button
                                    SizedBox(
                                      height: 56,
                                      child: ElevatedButton(
                                        onPressed: (_isLoading || !_isFormValid)
                                            ? null
                                            : _handleSignup,
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: gradientColors[0],
                                          foregroundColor: Colors.white,
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(
                                              12,
                                            ),
                                          ),
                                          elevation: 0,
                                          disabledBackgroundColor: Colors.grey
                                              .withOpacity(0.3),
                                        ),
                                        child: _isLoading
                                            ? const SizedBox(
                                                height: 24,
                                                width: 24,
                                                child: CircularProgressIndicator(
                                                  strokeWidth: 2,
                                                  valueColor:
                                                      AlwaysStoppedAnimation<
                                                        Color
                                                      >(Colors.white),
                                                ),
                                              )
                                            : const Text(
                                                'Create Account',
                                                style: TextStyle(
                                                  fontSize: 16,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                              ),
                                      ),
                                    ),

                                    const SizedBox(height: 24),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // Loading Overlay
          if (_isLoading)
            Container(
              color: Colors.black54,
              child: const Center(child: CircularProgressIndicator()),
            ),
        ],
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        text,
        style: Theme.of(
          context,
        ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600),
      ),
    );
  }

  InputDecoration _buildInputDecoration(
    String hint,
    IconData icon,
    bool isDarkMode,
  ) {
    return InputDecoration(
      hintText: hint,
      prefixIcon: Icon(icon, size: 20),
      filled: true,
      fillColor: isDarkMode ? Colors.grey[850] : Colors.grey[100],
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(
          color: isDarkMode ? const Color(0xFF0B1220) : const Color(0xFF0F172A),
          width: 2,
        ),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.red),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.red, width: 2),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
    );
  }
}
