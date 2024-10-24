insert into
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) (
        select
                '00000000-0000-0000-0000-000000000000',
                uuid_generate_v4 (),
                'authenticated',
                'authenticated',
                'default' || (ROW_NUMBER() OVER ()) || '@admin.fr',
                crypt ('default', gen_salt ('bf')),
                current_timestamp,
                current_timestamp,
                current_timestamp,
                '{"provider":"email","providers":["email"]}',
                json_build_object('username', 'default' || (ROW_NUMBER() OVER ()) || '')::json,
                current_timestamp,
                current_timestamp,
                '',
                '',
                '',
                ''
            FROM
                generate_series(1, 5)
        );

insert into
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) values (
        '00000000-0000-0000-0000-000000000000',
        uuid_generate_v4(),
        'authenticated',
        'authenticated',
        'bobi@admin.fr',
        crypt('bobiadmin', gen_salt('bf')),
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"username":"bobi"}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    );

insert into
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) values (
        '00000000-0000-0000-0000-000000000000',
        uuid_generate_v4(),
        'authenticated',
        'authenticated',
        'periicles@admin.fr',
        crypt('periiclesadmin', gen_salt('bf')),
        current_timestamp,
        current_timestamp,
        current_timestamp,
        '{"provider":"email","providers":["email"]}',
        '{"username":"periicles"}',
        current_timestamp,
        current_timestamp,
        '',
        '',
        '',
        ''
    );
